import AppError from "../../errors/AppError";
import type { IDonor } from "../donor/donor.interface";
import Donor from "../donor/donor.model";
import type { IUser } from "./user.interface";
import User from "./user.model";
import httpStatus from "http-status";
import { UserTrackingNumber } from "./user.utils";
import mongoose from "mongoose";
import Finder from "../finder/finder.model";

export const createNewDonorService = async (
  payload: IUser & Partial<IDonor>
) => {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User with this email already exists!"
    );
  }

  const donorExistingWithPhone = await User.find({
    phoneNumber: payload.phoneNumber,
  });

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    if (donorExistingWithPhone.length > 0) {
      donorExistingWithPhone.forEach((donor) => {
        if (!donor.isDeleted) {
          Donor.updateOne(
            { phoneNumber: payload.phoneNumber },
            { isDeleted: true }
          );
        }
      });
    }

    const trackingNumber = await UserTrackingNumber();
    payload.trackingNumber = trackingNumber;

    const newUser = await User.create(
      [
        {
          ...payload,
          role: "donor",
          accountStatus: "inactive",
        },
      ],
      { session }
    );

    const newDonor = await Donor.create([{ ...payload, availability: false }], {
      session,
    });

    await session.commitTransaction();
    await session.endSession();

    const createdUser = newUser[0];
    if (!createdUser) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create user!"
      );
    }

    const { password, ...restData } = createdUser.toObject();

    return { user: restData, donor: newDonor };
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error(error);
  }
};

export const createNewFinderService = async (payload: IUser) => {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User with this email already exists!"
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const trackingNumber = await UserTrackingNumber();
    payload.trackingNumber = trackingNumber;

    const newUser = await User.create([{ ...payload, role: "finder" }], {
      session,
    });
    const newFinder = await Finder.create([payload], { session });
    await session.commitTransaction();
    await session.endSession();

    const createdUser = newUser[0];
    if (!createdUser) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create user!"
      );
    }

    const { password, ...restData } = createdUser.toObject();

    const createdFinder = newFinder[0] ?? newFinder;

    return { user: restData, finder: createdFinder };
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error(error);
  }
};
