import AppError from "../../errors/AppError";
import type { IDonor } from "../donor/donor.interface";
import Donor from "../donor/donor.model";
import type { IUser } from "./user.interface";
import User from "./user.model";
import httpStatus from "http-status";
import { UserTrackingNumber } from "./user.utils";
import mongoose from "mongoose";

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

  if (donorExistingWithPhone.length > 0) {
    donorExistingWithPhone.forEach((donor) => {
      if (!donor.isDeleted) {
        Donor.updateOne(
          { phoneNumber: payload.phoneNumber },
          { isDeleted: true }
        );
      }
    });

    const session = await mongoose.startSession();

    try {
      await session.startTransaction();

      const trackingNumber = await UserTrackingNumber();
      payload.trackingNumber = trackingNumber;

      const newUser = await User.create({ ...payload, role: "donor" });
      const newDonor = await Donor.create(payload);

      await session.commitTransaction();
      await session.endSession();

      const { password, ...restData } = newUser.toObject();

      return { user: restData, donor: newDonor };
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();

      throw new Error(error);
    }
  }
};
