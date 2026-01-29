import z from "zod";

export const ContactValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters"),

    email: z.templateLiteral([z.string().min(1), "@", z.string().max(64)]),

    phoneNumber: z
      .string("Phone number is required")
      .regex(/^[0-9]{11}$/, "Phone number must be 11 digits")
      .optional(),

    subject: z
      .string()
      .min(3, "Subject must be at least 3 characters")
      .max(100, "Subject must be at most 100 characters"),

    message: z
      .string()
      .min(1, "Message is required")
      .max(150, "Message must not exceed 150 characters"),

    isReaded: z.boolean().optional(),
  }),
});
