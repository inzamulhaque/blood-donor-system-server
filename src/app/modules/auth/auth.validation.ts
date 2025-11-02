import z from "zod";

export const SignInValidationSchema = z.object({
  body: z.object({
    email: z.templateLiteral([z.string().min(1), "@", z.string().max(64)]),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(18, "Password must be at most 18 characters long"),
  }),
});
