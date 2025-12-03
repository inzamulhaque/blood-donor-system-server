import z from "zod";

export const BlockingUserValidationSchema = z.object({
  body: z.object({
    reason: z.string(),
  }),
});
