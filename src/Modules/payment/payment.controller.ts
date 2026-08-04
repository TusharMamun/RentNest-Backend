import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../util/catchAsync";
import { sendResponse } from "../../util/sendResponse";
import { paymentdbservice } from "./payment.service";
import { AppError } from "../../util/app-erro";
import Stripe from "stripe";
import { stripe } from "../../lib/strip";
import config from "../../config";
import z from "zod";
import { PaymentInputSchema } from "./paymentInputzodValidation";
import { PaymentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const webhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    throw new AppError(httpStatus.BAD_REQUEST, "Stripe signature is missing!");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.webhook_secret!
    );
  } catch (error: any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Webhook Error: ${error.message}`
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const rentRequestid = session.metadata?.requestId || session.metadata?.rentRequestid;

  if (rentRequestid) {

    if (event.type === "checkout.session.completed") {
await paymentdbservice.complitePayment(rentRequestid,session.id)

    }


    else if (event.type === "payment_intent.payment_failed") {
      await prisma.subscription.update({
        where: {
          rentRequestid: rentRequestid,
        },
        data: {
          status: PaymentStatus.FAILED,
        },
      });
   
    }


    else if (event.type === "checkout.session.expired") {
      await prisma.subscription.update({
        where: {
          rentRequestid: rentRequestid,
        },
        data: {
          status: PaymentStatus.FAILED,
        },
      });
      
    }
  }


  res.status(httpStatus.OK).json({
    received: true,
  });
});




const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;
    const requestProperty =PaymentInputSchema.parse( req.body);

    if (!tenantId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access! Tenant ID missing.");
    }

    const result = await paymentdbservice.creatChakoutsession(
      tenantId,
      requestProperty
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Checkout session created successfully!",
      data: result,
    });
  }
);

export const paymentController = {
  // createCheckoutSession,
};