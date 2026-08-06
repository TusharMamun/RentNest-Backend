import z, { string } from "zod";

export const PaymentInputSchema = z.object({

  requestId: z.uuid("Invalid Request ID! Must be a valid UUID."),
});

export const singlePaymentSchema=z.object({
id: z.string("Payment ID is required",
    ),
})