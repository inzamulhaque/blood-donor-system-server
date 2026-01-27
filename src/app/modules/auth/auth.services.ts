import AppError from "../../errors/AppError";
import User from "../user/user.model";

import bcrypt from "bcrypt";
import type { ISignin } from "./auth.interface";
import {
  createToken,
  formateForgetPasswordOTPEmail,
  formateResendOTPEmail,
  otpNumberGenerator,
  verifyToken,
} from "./auth.utils";
import config from "../../../config";
import { OldPassword, Otp } from "./auth.model";
import mongoose from "mongoose";
import sendEmail from "../../utils/sendEmail";
import Donor from "../donor/donor.model";

export const signinService = async (credentials: ISignin) => {
  const user = await User.findOne({
    email: credentials.email,
    isDeleted: false,
  });

  if (!user) {
    throw new AppError(401, "Invalid credentials!");
  }

  if (user?.blockStatus?.isBlocked) {
    throw new AppError(
      403,
      "Your account has been blocked. Please contact support!",
    );
  }

  if (user.accountStatus === "inactive") {
    throw new AppError(
      403,
      "Your account is inactive. Please activate your account by verifying your email or reset password!",
    );
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid password!");
  }

  const token = createToken(
    {
      trackingNumber: user.trackingNumber,
      role: user.role,
    },
    config.JWT_ACCESS_SECRET,
    config.JWT_ACCESS_EXPIRES_IN,
  );

  const refreshToken = createToken(
    {
      trackingNumber: user.trackingNumber,
      role: user.role,
    },
    config.JWT_REFRESH_SECRET,
    config.JWT_REFRESH_EXPIRES_IN,
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
    throw new AppError(404, "User not found!");
  }

  const isOldPasswordValid = await bcrypt.compare(
    payload.oldPassword,
    user.password,
  );

  if (!isOldPasswordValid) {
    throw new AppError(401, "Old password is incorrect!");
  }

  const oldAndNewPasswordSame = await bcrypt.compare(
    payload.newPassword,
    user.password,
  );

  if (oldAndNewPasswordSame) {
    throw new AppError(
      400,
      "New password must be different from the old password!",
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
      400,
      "You cannot use a previously used password. Please choose a different password!",
    );
  }

  const hashedNewPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.BCRYPT_SALT_ROUNDS),
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updatedPassword = await user.updateOne(
      { $set: { password: hashedNewPassword } },
      { session },
    );

    await OldPassword.deleteOne(
      { trackingNumber: payload.trackingNumber },
      { session },
    );

    await OldPassword.create(
      [
        {
          trackingNumber: payload.trackingNumber,
          oldPassword: user.password,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    if (updatedPassword.modifiedCount === 0) {
      throw new AppError(500, "Failed to update password!");
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

export const verifyingOtpService = async (
  trackingNumber: number,
  otp: number,
) => {
  const otpData = await Otp.findOne({
    trackingNumber,
  });

  const userData = await User.findOne({
    trackingNumber,
  });

  if (!otpData || !userData) {
    throw new AppError(400, "User not found!");
  }

  if (otpData.otp !== otp) {
    throw new AppError(400, "Invalid OTP!");
  }

  const fiveMinInMs = 5 * 60 * 1000;

  const createdAt = otpData?.createdAt;

  // @ts-ignore
  const isExpired = Date.now() - new Date(createdAt).getTime() > fiveMinInMs;

  if (isExpired) {
    throw new AppError(410, "OTP has expired!");
  }

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    await Otp.deleteOne({ trackingNumber, otp }, { session });

    const updateAccountStatus = await User.updateOne(
      { trackingNumber, isDeleted: false },
      { $set: { accountStatus: "active" } },
      { session },
    );

    if (userData.role === "donor") {
      await Donor.updateOne(
        { trackingNumber, isDeleted: false },
        { $set: { availability: true } },
        { session },
      );
    }

    await session.commitTransaction();
    await session.endSession();

    if (updateAccountStatus.modifiedCount === 0) {
      throw new AppError(500, "Failed to verify OTP!");
    }

    return updateAccountStatus;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    console.log(error);
  }
};

export const resendOtpService = async (trackingNumber: number) => {
  const user = await User.findOne({ trackingNumber, isDeleted: false });

  if (!user) {
    throw new AppError(404, "User not found!");
  }

  const newOtp = await otpNumberGenerator();

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    await Otp.deleteOne({ trackingNumber }, { session });

    await Otp.create(
      [
        {
          trackingNumber,
          otp: newOtp,
          otpFor: "resend-otp",
        },
      ],
      { session },
    );

    await session.commitTransaction();
    await session.endSession();

    const emailBody = formateResendOTPEmail(user.name, newOtp);
    const emailSubject =
      "আপনার একাউন্ট যাচাইয়ের জন্য ওটিপি পুনরায় পাঠানো হয়েছে";

    const sendEmailResponse = await sendEmail(
      user.email,
      emailSubject,
      emailBody,
    );

    return sendEmailResponse;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    console.log(error);
  }
};

export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email, isDeleted: false });

  if (!user) {
    throw new AppError(404, "User not found!");
  }

  const newOtp = await otpNumberGenerator();

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    await Otp.deleteOne({ trackingNumber: user.trackingNumber }, { session });
    await Otp.create(
      [
        {
          trackingNumber: user.trackingNumber,
          otp: newOtp,
          otpFor: "password-reset",
        },
      ],
      { session },
    );

    await session.commitTransaction();
    await session.endSession();

    const emailBody = formateForgetPasswordOTPEmail(user.name, newOtp);
    const emailSubject = "আপনার পাসওয়ার্ড রিসেট করার জন্য ওটিপি";

    const emailInfo = await sendEmail(user.email, emailSubject, emailBody);

    return { emailInfo, user: user.trackingNumber };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    console.log(error);
  }
};

export const resetPasswordService = async (
  trackingNumber: number,
  otp: number,
  newPassword: string,
) => {
  const otpData = await Otp.findOne({
    trackingNumber,
  });

  if (!otpData) {
    throw new AppError(400, "User not found!");
  }

  if (otpData.otp !== otp) {
    throw new AppError(400, "Invalid OTP!");
  }

  const fiveMinInMs = 5 * 60 * 1000;

  const createdAt = otpData?.createdAt;

  // @ts-ignore
  const isExpired = Date.now() - new Date(createdAt).getTime() > fiveMinInMs;

  if (isExpired) {
    throw new AppError(410, "OTP has expired!");
  }

  const user = await User.findOne({ trackingNumber, isDeleted: false });

  if (!user) {
    throw new AppError(404, "User not found!");
  }

  const oldAndNewPasswordSame = await bcrypt.compare(
    newPassword,
    user.password,
  );

  if (oldAndNewPasswordSame) {
    throw new AppError(
      400,
      "New password must be different from the old password!",
    );
  }

  const haveOldPassword = await OldPassword.findOne({
    trackingNumber: String(trackingNumber),
  });

  const isPasswordusedBefore = haveOldPassword
    ? await bcrypt.compare(newPassword, haveOldPassword.oldPassword)
    : false;

  if (isPasswordusedBefore) {
    throw new AppError(
      400,
      "You cannot use a previously used password. Please choose a different password!",
    );
  }

  const hashedNewPassword = await bcrypt.hash(
    newPassword,
    Number(config.BCRYPT_SALT_ROUNDS),
  );

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    await Otp.deleteOne({ trackingNumber, otp }, { session });

    const updatePassword = await user.updateOne(
      { $set: { password: hashedNewPassword, accountStatus: "active" } },
      { session },
    );

    await OldPassword.deleteOne(
      { trackingNumber: trackingNumber },
      { session },
    );

    await OldPassword.create(
      [
        {
          trackingNumber: trackingNumber,
          oldPassword: user.password,
        },
      ],
      { session },
    );

    await Otp.deleteOne({ trackingNumber, otp }, { session });

    await session.commitTransaction();
    await session.endSession();

    return updatePassword;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    console.log(error);
  }
};

export const refreshTokenService = async (token: string) => {
  const decoded = verifyToken(token, config.JWT_REFRESH_SECRET);

  const { trackingNumber } = decoded;

  const user = await User.findOne({ trackingNumber, isDeleted: false });

  if (!user) {
    throw new AppError(404, "User not found!");
  }

  if (user?.blockStatus?.isBlocked) {
    throw new AppError(
      403,
      "Your account has been blocked. Please contact support!",
    );
  }

  const jwtPayload = {
    trackingNumber: user.trackingNumber,
    role: user.role,
  };

  const newAccessToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET,
    config.JWT_ACCESS_EXPIRES_IN,
  );

  return newAccessToken;
};
