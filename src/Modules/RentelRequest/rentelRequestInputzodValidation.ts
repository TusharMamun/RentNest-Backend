import { z } from "zod";

export const createPropertyRequestInputValidation = z
  .object({
    propertyId: z .uuid("Invalid Property ID! Please provide a valid UUID."),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .refine((input) => input.endDate > input.startDate, {
    message: "End date must be strictly after the start date",
    path: ["endDate"],
  });

  export type createPropertyRequestInput = z.infer<typeof createPropertyRequestInputValidation>;