import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import type { TBloodGroup, TUpozila } from "../donor/donor.interface";
import Donor from "../donor/donor.model";
import Finder from "./finder.model";
import User from "../user/user.model";
import mongoose from "mongoose";

export const findDonorService = async (payload: {
  bloodGroup: TBloodGroup;
  upozila: TUpozila;
}) => {
  const donors = await Donor.find({
    bloodGroup: payload.bloodGroup,
    upozila: payload.upozila,
    accountVisibility: "public",
    availability: true,
    isDeleted: false,
  });

  return donors;
};

export const changeFinderToDonorService = async (
  trackingNumber: number,
  bloodGroup: TBloodGroup
) => {
  const user = await User.findOne({
    trackingNumber: trackingNumber,
  });

  const finder = await Finder.findOne({
    trackingNumber: trackingNumber,
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  if (!finder) {
    throw new AppError(httpStatus.NOT_FOUND, "Finder not found!");
  }

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const newDonor = await Donor.create(
      [
        {
          name: finder.name,
          email: finder.email,
          phoneNumber: finder.phoneNumber,
          trackingNumber: finder.trackingNumber,
          upozila: finder.upozila,
          bloodGroup: bloodGroup,
          availability: true,
        },
      ],
      { session }
    );

    await finder.updateOne(
      {
        $set: { isDeleted: true },
      },
      { session }
    );

    await user.updateOne(
      {
        $set: { role: "donor" },
      },
      { session }
    );

    await session.commitTransaction();
    await session.endSession();

    return newDonor[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    console.log(error);
  }
};
