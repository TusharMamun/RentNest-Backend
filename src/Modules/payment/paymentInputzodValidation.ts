import z from "zod";

export const PaymentInputSchema = z.object({
  propertyId: z.uuid("Invalid Property ID! Must be a valid UUID."),
  requestId: z.uuid("Invalid Request ID! Must be a valid UUID."),
});