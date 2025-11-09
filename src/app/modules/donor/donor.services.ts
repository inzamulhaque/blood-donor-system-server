import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import type { IDonateDate, IDonor } from "./donor.interface";
import Donor, { DonateDate } from "./donor.model";
import mongoose from "mongoose";

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
  payload: { date: string; note?: string },
  trackingNumber: number
) => {
  const donor = await Donor.findOne({
    trackingNumber,
    isDeleted: false,
  });

  const [day, month, year] = payload?.date?.split("-");

  const now = new Date();

  const donateDate = new Date(`${year}-${month}-${day}`);

  const diffInMs = now.getTime() - donateDate.getTime();

  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  const readyForDonate: boolean = diffInDays >= 90;

  const lastDonoteDate = donor?.lastDonoteDate;

  let newLastDonoteDate;

  if (lastDonoteDate) {
    const lastDonoteTime =
      lastDonoteDate instanceof Date
        ? lastDonoteDate.getTime()
        : new Date(lastDonoteDate as any).getTime();

    if (lastDonoteTime < donateDate.getTime()) {
      newLastDonoteDate = donateDate;
    } else {
      newLastDonoteDate = lastDonoteDate;
    }
  } else {
    newLastDonoteDate = donateDate;
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await donor?.updateOne(
      [
        {
          $set: {
            lastDonoteDate: newLastDonoteDate,
            availability: readyForDonate,
          },
        },
      ],
      {
        session,
      }
    );

    const addDonateDate = await DonateDate.create({
      donorId: donor?._id,
      date: donateDate,
      note: payload?.note,
    });

    session.commitTransaction();
    session.endSession();

    return addDonateDate;
  } catch (error: any) {
    session.abortTransaction();
    session.endSession();

    console.log(error);
  }
};
