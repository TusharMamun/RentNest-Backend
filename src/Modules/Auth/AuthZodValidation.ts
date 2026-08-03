import z from "zod";

export const LoginInfoSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type loginguserInput =  z.infer<typeof LoginInfoSchema>;