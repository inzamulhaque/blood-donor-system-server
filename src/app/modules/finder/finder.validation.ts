import z from "zod";
import { BloodGroupEnum, UpozilaEnum } from "../donor/donor.validation";

export const FindDonorValidationSchema = z.object({
  body: z.object({
    bloodGroup: BloodGroupEnum,
    upozila: UpozilaEnum,
  }),
});
