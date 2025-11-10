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
  // find donor
  const donor = await Donor.findOne({
    trackingNumber,
    isDeleted: false,
  });

  // validated donor found or not
  if (!donor) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Donor not found!");
  }

  // today date
  const now = new Date();

  const [day, month, year] = payload?.date?.split("-");

  // donate date
  const donateDate = new Date(`${year}-${month}-${day}`);

  // this date already exist in DB
  const findInDB = await DonateDate.findOne({
    date: donateDate,
  });

  if (findInDB) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This date already exists in the database!"
    );
  }

  const diffInMs = now.getTime() - donateDate.getTime();

  // different between today and donate date
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  // validation date for not adding advance date
  if (diffInDays <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are not able to add an advance date!"
    );
  }

  const readyForDonate: boolean = diffInDays >= 90;

  // last donate date from DB
  const lastDonateDate = donor?.lastDonateDate || donateDate;

  let newLastDonateDate;

  // calculate new last donate date from compare DB last donate date and input last donate date
  if (lastDonateDate) {
    const lastDonateTime =
      lastDonateDate instanceof Date
        ? lastDonateDate.getTime()
        : new Date(lastDonateDate as any).getTime();

    if (lastDonateTime < donateDate.getTime()) {
      newLastDonateDate = donateDate;
    } else {
      newLastDonateDate = lastDonateDate;
    }
  } else {
    newLastDonateDate = donateDate;
  }

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    await donor?.updateOne(
      [
        {
          $set: {
            lastDonateDate: newLastDonateDate,
            availability: readyForDonate,
          },
        },
      ],
      {
        session,
      }
    );

    const addDonateDate = await DonateDate.create(
      [
        {
          donorId: donor?._id,
          date: donateDate,
          note: payload?.note,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    await session.endSession();

    return addDonateDate;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    console.log(error);
  }
};
