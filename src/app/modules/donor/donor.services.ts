import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import type { IDonor } from "./donor.interface";
import Donor from "./donor.model";

export const addNewDonorService = async (payload: IDonor) => {
  const isDonorExist = await Donor.findOne({
    phoneNumber: payload.phoneNumber,
  });

  if (isDonorExist) {
    throw new AppError(httpStatus.CONFLICT, "Donor already exists!");
  }

  const result = await Donor.create(payload);
  return result;
};
