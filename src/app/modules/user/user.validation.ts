import z from "zod";

import { roles } from "./user.constant";
import { UpozilaEnum } from "../donor/donor.validation";

export const BlockStatusValidationSchema = z.object({
  isBlocked: z.boolean().default(false).optional(),
  blockReason: z.string().optional(),
  blockedBy: z.number().optional(),
});

export const UserValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: "User name is required" })
      .min(2, { message: "Name must be at least 2 characters long" }),

    email: z
      .string()
      .trim()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),

    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(18, { message: "Password must not exceed 18 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,18}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }
      ),

    role: z.enum(roles).default("donor"),

    accountVisibility: z
      .enum(["public", "private"])
      .default("public")
      .optional(),

    accountStatus: z
      .enum(["active", "inactive"])
      .default("inactive")
      .optional(),

    blockStatus: BlockStatusValidationSchema.optional(),

    isDeleted: z.boolean().default(false).optional(),
  }),
});

export const UpdateUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: "User name is required" })
      .min(2, { message: "Name must be at least 2 characters long" })
      .optional(),

    upozila: UpozilaEnum.optional(),
  }),
});
