import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import httpStatus from "http-status";
import { catchAsync } from "../../util/catchAsync";
import config from "../../config";
import { stripe } from "../../lib/strip";
import { PaymentInputSchema, singlePaymentSchema } from "./paymentInputzodValidation";
import { complitPayment, creatCheckoutSession, paymentServices } from "./payment.service";
import { sendResponse } from "../../util/sendResponse";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../util/app-erro";




export const webhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers["stripe-signature"];

   if (!signature) {
  throw new AppError(
    httpStatus.BAD_REQUEST, 
    "Missing Stripe signature header"
  );
}

    const webhookSecret = config.webhook_secret!

if (!webhookSecret) {
  throw new AppError(
    httpStatus.INTERNAL_SERVER_ERROR,
    "Missing STRIPE_WEBHOOK_SECRET in environment variables"
  );
}

    let event: Stripe.Event;

    try {
      // req.body MUST be a Buffer/raw string here
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (err: any) {
      // res.status(400).send(`Webhook Error: ${err.message}`);
      // return;
throw new AppError(
  httpStatus.BAD_REQUEST,
  `Webhook Error: ${err.message}`
);
    }
   const session = event.data.object as {
  id: string;
  metadata?: {
    rentelId?: string;
  };
};
const renterId =session.metadata?.rentelId
if(renterId){
  if(event.type==="checkout.session.completed"){
await complitPayment(renterId,session.id)
  }else if (
      event.type === "checkout.session.expired" ||
      event.type === "checkout.session.async_payment_failed"
    ) {
      await prisma.subscription.updateMany({
        where: { rentRequestid:renterId, status:"PENDING" },
        data: { status: "FAILED" },
      });
    }
    
}

  res.json({ received: true });

  }
);

export const checkout= catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = PaymentInputSchema.parse(req.body)
    const renterId = req.user?.id
    const result = await creatCheckoutSession(payload,renterId as string  )
 sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED, 
      message: "Checkout session created successfully!",
      data: result,
    });
  })


export const getAllPaymentController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // ১. Service Layer থেকে সব পেমেন্টের ডাটা ফেচ করা
    const result = await paymentServices.getAllPaymentService();

    // ২. ক্লায়েন্টে রেসপন্স পাঠানো
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payments retrieved successfully!",
      data: result,
    });
  }
);
export const getSinglePaymentDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = singlePaymentSchema.parse(req.params)

    // ১. ID দিয়ে নির্দিষ্ট পেমেন্ট ডাটা ফেচ করা
    const result = await paymentServices.getSinglePaymentFromDB(id);

    // ২. রেসপন্স পাঠানো
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment details retrieved successfully!",
      data: result,
    });
  }
);