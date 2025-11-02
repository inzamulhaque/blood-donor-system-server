import AppError from "../../errors/AppError";
import User from "../user/user.model";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import type { ISignin } from "./auth.interface";

const signinService = async (credentials: ISignin) => {
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

  return user;
};
