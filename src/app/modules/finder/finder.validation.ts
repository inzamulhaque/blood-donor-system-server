import z from "zod";
import { BloodGroupEnum, UpozilaEnum } from "../donor/donor.validation";

export const FinderToDonorValidationSchema = z.object({
  body: z.object({
    bloodGroup: BloodGroupEnum,
  }),
});
