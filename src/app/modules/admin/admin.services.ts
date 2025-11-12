import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import User from "../user/user.model";

export const getAllUserService = async () => {
  const users = await User.find();

  if (!users) {
    throw new AppError(httpStatus.NOT_FOUND, "No users found!");
  }

  return users;
};
