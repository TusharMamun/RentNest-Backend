import { id } from "zod/locales";
import { AvailabilityStatus, PaymentStatus, RequestStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/strip";
import { AppError } from "../../util/app-erro";
import { IPayment } from "./payment.interface";
import httpStatus from "http-status";

const creatChakoutsession = async (tenantId: string, payload: IPayment) => {
  const { propertyId, requestId } = payload;

  const paymentUrl = await prisma.$transaction(async (tx) => {
    // ১. Tenant ডাটা নিয়ে আসা
    const tenantUser = await tx.user.findFirstOrThrow({
      where: {
        id: tenantId,
      },
      include: {
        subscriptions: true,
      },
    });

    // ২. Property ডাটা চেক করা
    const existProperty = await tx.property.findFirstOrThrow({
      where: {
        id: propertyId,
      },
    });

    // ৩. Rental Request ডাটা ও Status চেক করা
    const existRequest = await tx.rentalRequest.findFirstOrThrow({
      where: {
        id: requestId,
      },
      include: {
        property: true,
        subscriptions: true,
      },
    });

    // ল্যান্ডলর্ড যেন নিজের প্রপার্টিতে পেমেন্ট না করতে পারে
    if (tenantId === existProperty.landlordId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You cannot make or process a rental request for your own property!"
      );
    }

    // রিকোয়েস্ট Approved না হলে পেমেন্ট করা যাবে না
    if (existRequest.status !== RequestStatus.APPROVED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Your rental request is not approved yet!"
      );
    }

    // ইতোমধ্যে পেমেন্ট সম্পন্ন হলে আটকাবে
    if (existRequest.subscriptions?.status === PaymentStatus.COMPLETED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Payment has already been completed for this rental request!"
      );
    }

    // ৪. Stripe Customer ID বের করা / নতুন তৈরি করা
    let stripcustomerId = tenantUser.subscriptions?.[0]?.stripeCustomerId;

    if (!stripcustomerId) {
      const customer = await stripe.customers.create({
        email: tenantUser.email,
        name: tenantUser.name,
        metadata: {
          userid: tenantUser.id,
        },
      });

      stripcustomerId = customer.id;
    }

    // ৫. Stripe Checkout Session তৈরি করা
    const paymentAmount = existRequest.totalPrice;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: existProperty.title || "Rental Property Payment",
              description: existProperty.description || undefined,
            },
            unit_amount: Math.round(Number(paymentAmount) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer: stripcustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/succespayment?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.app_url}/paymentpage?success=false`,
      metadata: {
        userId: tenantUser.id,
        propertyId: existProperty.id,
        requestId: existRequest.id,
      },
    });

    
    await tx.subscription.upsert({
      where: {
        rentRequestid: existRequest.id,
      },
    
      create: {
        tenantId: tenantUser.id,
        rentRequestid: existRequest.id,
        totalAmount: existRequest.totalPrice,
        stripeCustomerId: stripcustomerId,
      },
        update: {
        totalAmount: existRequest.totalPrice,
        stripeCustomerId: stripcustomerId,
        tenantId: tenantUser.id,
        trasectionId:session.id
      },
    });

    return session.url;
  });

  return {
    paymentUrl,
  };
};
const complitePayment =async(rentRequestid:string,transectionId:string)=>{
const findrentelId = await prisma.rentalRequest.findUniqueOrThrow({
  where:{
    id:rentRequestid
  }
})
const properyid = findrentelId.propertyId
 await prisma.property.update({
  where:{
    id:properyid
  },
    data: {
          isAvailable: AvailabilityStatus.NOT_AVAILABLE, 
        },
})


const payment = await prisma.subscription.findUnique({
  where:{
    id:rentRequestid
  }
})



if(payment?.status ===PaymentStatus.COMPLETED) return


     await prisma.subscription.update({
        where: {
        id:transectionId
        },
        data: {
          status: PaymentStatus.COMPLETED, 
        },
      });
}
export const paymentdbservice = {
  creatChakoutsession,
  complitePayment
};