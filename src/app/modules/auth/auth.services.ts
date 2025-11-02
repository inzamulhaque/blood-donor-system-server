import AppError from "../../errors/AppError";
import User from "../user/user.model";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import type { ISignin } from "./auth.interface";
import { createToken } from "./auth.utils";
import config from "../../../config";

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
