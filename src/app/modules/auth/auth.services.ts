import AppError from "../../errors/AppError";
import User from "../user/user.model";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import type { ISignin } from "./auth.interface";
import { createToken } from "./auth.utils";
import config from "../../../config";
import { OldPassword } from "./auth.model";
import mongoose from "mongoose";
import { log } from "node:console";

export const signinService = async (credentials: ISignin) => {
  const user = await User.findOne({
    email: credentials.email,
    isDeleted: false,
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials!");
  }

  if (user?.blockStatus?.isBlocked) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account has been blocked. Please contact support!"
    );
  }

  if (user.accountStatus === "inactive") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account is inactive. Please activate your account by verifying your email!"
    );
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password!");
  }

  const token = createToken(
    {
      trackingNumber: user.trackingNumber,
      role: user.role,
    },
    config.JWT_ACCESS_SECRET,
    config.JWT_ACCESS_EXPIRES_IN
  );

  const refreshToken = createToken(
    {
      trackingNumber: user.trackingNumber,
      role: user.role,
    },
    config.JWT_REFRESH_SECRET,
    config.JWT_REFRESH_EXPIRES_IN
  );

  return {
    token,
    refreshToken,
  };
};

export const changePasswordService = async (payload: {
  trackingNumber: number;
  oldPassword: string;
  newPassword: string;
}) => {
  const user = await User.findOne({
    trackingNumber: payload.trackingNumber,
    isDeleted: false,
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  const isOldPasswordValid = await bcrypt.compare(
    payload.oldPassword,
    user.password
  );

  if (!isOldPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password is incorrect!");
  }

  const oldAndNewPasswordSame = await bcrypt.compare(
    payload.newPassword,
    user.password
  );

  if (oldAndNewPasswordSame) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password must be different from the old password!"
    );
  }

  const haveOldPassword = await OldPassword.findOne({
    trackingNumber: String(payload.trackingNumber),
  });

  const isPasswordusedBefore = haveOldPassword
    ? await bcrypt.compare(payload.newPassword, haveOldPassword.oldPassword)
    : false;

  if (isPasswordusedBefore) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot use a previously used password. Please choose a different password!"
    );
  }

  const hashedNewPassword = await bcrypt.hash(payload.newPassword, 10);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updatedPassword = await user.updateOne(
      { $set: { password: hashedNewPassword } },
      { session }
    );

    await OldPassword.deleteOne(
      { trackingNumber: payload.trackingNumber },
      { session }
    );

    await OldPassword.create(
      [
        {
          trackingNumber: payload.trackingNumber,
          oldPassword: user.password,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    if (updatedPassword.modifiedCount === 0) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update password!"
      );
    }

    return {
      userName: user.name,
      email: user.email,
      message: "Password changed successfully!",
    };
  } catch (error: any) {
    session.abortTransaction();
    session.endSession();

    console.log(error);
  }
};
