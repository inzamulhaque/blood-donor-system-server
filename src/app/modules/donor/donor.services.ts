import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import type { IDonateDate, IDonor } from "./donor.interface";
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

export const addDonateDateService = async (
  payload: Partial<IDonateDate>,
  trackingNumber: number
) => {
  const donor = await Donor.findOne({
    trackingNumber: String(trackingNumber),
    isDeleted: false,
  });

  console.log(donor);
};
