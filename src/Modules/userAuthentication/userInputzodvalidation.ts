import z from "zod";

export const creatUserSchema = z.object({
name: z.string().min(1, "Name is required"),
email: z .email("Invalid email format"),
password: z.string().min(6, "Password must be at least 6 characters long"),
role: z.enum(["ADMIN", "LANDLORD", "TENANT"],).optional(),
profilePhoto: z.url("Invalid URL format").optional(),
    bio: z.string().optional()
})

export const updateUserSchema = z.object({
name: z.string().min(1, "Name cannot be empty").optional(),
    email: z.email("Invalid email format").optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .optional(),
    role: z.enum(["ADMIN", "LANDLORD", "TENANT"]).optional(),
    profilePhoto: z.url("Invalid URL format").optional(),
    bio: z.string().optional()
})

export type CreatUserDataInput =  z.infer<typeof creatUserSchema>;
export type updateUser =  z.infer<typeof updateUserSchema>;