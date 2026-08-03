import { z } from "zod";


export const createPropertyZodSchema = z.object({

    title: z.string().min(1, "title is required"),
    description: z.string().min(1, "description is required"),
    location: z.string().min(1, "location is required"),
    pricePerMonth: z
      .number("pricePerMonth is required")
      .positive("pricePerMonth must be positive"),
    amenities: z
      .array(z.string())
      .min(1, "at least one amenity is required"),
    isAvailable: z.enum(["AVAILABLE", "NOT_AVAILABLE"]).optional(),
    catagoyName: z.string().optional(),
  })

export const singlePropertyGetZodSchema =z.object({
 id: z.uuid("Invalid property ID"),
})


// export const updateStatus=z.object({

// )}
export const updateStausSchema =z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"],"Actual status is required")
})
export type createPropertyinput =  z.infer<typeof createPropertyZodSchema>;
export type getValidpamrs =  z.infer<typeof singlePropertyGetZodSchema>;
export type UpdateUstausInput =  z.infer<typeof updateStausSchema>;