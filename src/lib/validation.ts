import { z } from "zod";

export const SignUpSchema = z.object({
  role: z.enum(["user", "company"]),
  email: z.string().email("Invalid email address"),
  username: z.string().min(4, "Username must be between 4 and 15 characters").max(15, "Username must be between 4 and 15 characters"),
  password: z.string().min(6 ,"Password must be between 6 and 30 characters").max(30, "Password must be between 6 and 30 characters"),
  company: z.string().min(2, "Company name must be between 2 and 30 characters").max(30, "Company name must be between 2 and 30 characters").optional(),
}).refine(
  (data) => data.role === "user" || !!data.company,
  { message: "Company name is required for company role", path: ["company"] }
);


export type SignUpData = z.infer<typeof SignUpSchema>;


export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6 ,"Password must be between 6 and 30 characters").max(30, "Password must be between 6 and 30 characters"),
});

export type SignInData = z.infer<typeof SignInSchema>;