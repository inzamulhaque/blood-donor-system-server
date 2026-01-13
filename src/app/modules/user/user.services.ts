import AppError from "../../errors/AppError";
import type { IDonor, TUpozila } from "../donor/donor.interface";
import Donor from "../donor/donor.model";
import type { IUser } from "./user.interface";
import User from "./user.model";

import { sendAccActivationEmail, UserTrackingNumber } from "./user.utils";
import mongoose from "mongoose";
import Finder from "../finder/finder.model";
import type { JwtPayload } from "jsonwebtoken";
import { otpNumberGenerator } from "../auth/auth.utils";
import { Otp } from "../auth/auth.model";

export const createNewDonorService = async (
  payload: IUser & Partial<IDonor>
) => {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError(409, "User with this email already exists!");
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

    const otp = await otpNumberGenerator();

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

    await Otp.create(
      [
        {
          trackingNumber: trackingNumber,
          otp: otp,
          otpFor: "account-activation",
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
      throw new AppError(500, "Failed to create user!");
    }

    const { password, ...restData } = createdUser.toObject();

    const emailInfo = await sendAccActivationEmail(
      createdUser.email,
      createdUser.name,
      otp
    );

    return { user: restData, donor: newDonor, emailInfo };
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error(error);
  }
};

export const createNewFinderService = async (payload: IUser) => {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError(409, "User with this email already exists!");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const trackingNumber = await UserTrackingNumber();
    payload.trackingNumber = trackingNumber;

    const otp = await otpNumberGenerator();

    const newUser = await User.create([{ ...payload, role: "finder" }], {
      session,
    });

    await Otp.create(
      [
        {
          trackingNumber: trackingNumber,
          otp: otp,
          otpFor: "account-activation",
        },
      ],
      { session }
    );

    const newFinder = await Finder.create([payload], { session });
    await session.commitTransaction();
    await session.endSession();

    const createdUser = newUser[0];
    if (!createdUser) {
      throw new AppError(500, "Failed to create user!");
    }

    const { password, ...restData } = createdUser.toObject();

    const createdFinder = newFinder[0] ?? newFinder;

    const emailInfo = await sendAccActivationEmail(
      createdUser.email,
      createdUser.name,
      otp
    );

    return { user: restData, finder: createdFinder, emailInfo };
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error(error);
  }
};

export const getMeService = async (payload: JwtPayload) => {
  const user = await User.findOne({
    trackingNumber: payload.trackingNumber,
  })
    .select("-password -_id")
    .lean();

  if (!user) {
    throw new AppError(400, "User not found!");
  }

  let otherInfo: any = {};

  if (user?.role === "donor" || user?.role === "admin") {
    otherInfo = await Donor.findOne({
      trackingNumber: payload.trackingNumber,
      isDeleted: false,
    })
      .select("-_id")
      .lean();
  }

  if (user?.role === "finder") {
    otherInfo = await Finder.findOne({
      trackingNumber: payload.trackingNumber,
    })
      .select("-_id")
      .lean();
  }

  return { ...user, ...otherInfo };
};

export const updateUserService = async (
  payload: { name?: string; upozila?: TUpozila },
  trackingNumber: number
) => {
  const user = await User.findOne({
    trackingNumber,
  });

  if (!user) {
    throw new AppError(401, "User not found!");
  }

  let otherData: any;

  if (user.role === "donor" || user.role === "admin") {
    otherData = await Donor.findOne({
      trackingNumber: user.trackingNumber,
    });
  }

  if (user.role === "finder") {
    otherData = await Finder.findOne({
      trackingNumber: user.trackingNumber,
    });
  }

  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    await user.updateOne(
      {
        $set: {
          ...payload,
        },
      },
      { session }
    );

    const updatedData = await otherData.updateOne(
      {
        $set: {
          ...payload,
        },
      },
      { new: true, session }
    );

    await session.commitTransaction();
    await session.endSession();

    return updatedData;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    console.log(error);
  }
};

export const getUserDetailsByTrackingNumberService = async (
  trackingNumber: number
) => {
  const user = await User.findOne({
    trackingNumber,
  });

  if (!user) {
    throw new AppError(401, "User not found!");
  }

  let otherData: any;

  if (user.role === "donor" || user.role === "admin") {
    otherData = await Donor.findOne({
      trackingNumber: user.trackingNumber,
    });
  }

  if (user.role === "finder") {
    otherData = await Finder.findOne({
      trackingNumber: user.trackingNumber,
    });
  }

  otherData = otherData.toObject();

  const { password, ...restData } = user.toObject();

  return { ...restData, ...otherData };
};
