import z from "zod";


export const singleUserZodSchema=z.object({
  id:z.uuid("Invalid User ID format! Please provide a valid UUID."),
})
export const updateuserStatusSchema=z.object({
 userStatus: z.enum(["BAN", "UNBAN"],"Status must be either 'BAN' or 'UNBAN'")
})

export type getsingleUserId =  z.infer<typeof singleUserZodSchema>;
export type updateuserInput =  z.infer<typeof updateuserStatusSchema>;