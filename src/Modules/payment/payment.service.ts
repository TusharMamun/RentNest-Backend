import { RequestStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/strip";
import { IPayment } from "./payment.interface";

const creatChakoutsession = async (tenantId: string, payload: IPayment) => {
  const { propertyId, requestId } = payload;

  const paymentUrl = await prisma.$transaction(async (tx) => {
    // ১. Tenant ডাটা নিয়ে আসা
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
    });

    if (existRequest.status !== RequestStatus.APPROVED) {
      throw new Error("Your rental request is not approved yet!");
    }

    // ৪. Stripe Customer ID বের করা / নতুন তৈরি করা
    let stripcustomerId = tenantUser.subscriptions?.stripeCustomerId;

    if (!stripcustomerId) {
      const customer = await stripe.customers.create({
        email: tenantUser.email,
        name: tenantUser.name,
        metadata: {
          userid: tenantUser.id,
        },
      });

   
      stripcustomerId = customer.id;

      // 💡 অপশনাল: ডাটাবেজে Customer ID সেভ করে রাখা
      /*
      await tx.subscription.upsert({
        where: { userId: tenantUser.id },
        update: { stripeCustomerId: customer.id },
        create: { userId: tenantUser.id, stripeCustomerId: customer.id },
      });
      */
    }

    // ৫. Stripe Checkout Session তৈরি করা
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: existProperty.title || "Rental Property Payment",
              description: existProperty.description || undefined,
            },
            unit_amount: Math.round(Number(existProperty.pricePerMonth) * 100),
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

    return session.url;
  });

  return {
    paymentUrl,
  };
};

export const paymentdbservice = {
  creatChakoutsession,
};