import { z } from "zod";
import { BLOOD_GROUPS, UPOZILAS_PABNA } from "./donor.constant";

export const BloodGroupEnum = z.enum(BLOOD_GROUPS);
export const UpozilaEnum = z.enum(UPOZILAS_PABNA);

export const DonorValidationSchema = z.object({
  body: z.object({
    name: z
      .string("Donor name is required")
      .trim()
      .min(2, "Name must be at least 2 characters long"),

    email: z.string().trim().email("Invalid email address").optional(),

    phoneNumber: z
      .string("Phone number is required")
      .regex(/^[0-9]{11}$/, "Phone number must be 11 digits"),

    bloodGroup: BloodGroupEnum,

    upozila: UpozilaEnum,

    addedBy: z.number().optional(),

    lastDonoteDate: z.date().optional(),

    accountVisibility: z.enum(["public", "private"]).default("public"),

    accountStatus: z.enum(["active", "inactive"]).default("active"),

    isBlocked: z.boolean().default(false),

    isDeleted: z.boolean().default(false),
  }),
});

export type DonorValidationType = z.infer<typeof DonorValidationSchema>;
