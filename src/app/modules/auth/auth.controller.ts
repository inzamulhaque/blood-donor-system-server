import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { changePasswordService, signinService } from "./auth.services";
import config from "../../../config";

export const signin = catchAsync(async (req, res) => {
  const { token, refreshToken } = await signinService(req.body);

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in successfully!",
    data: { token },
  });
});

export const changePassword = catchAsync(async (req, res) => {
  const trackingNumber = req.user?.trackingNumber;
  const payload = { ...req.body, trackingNumber };

  const result = await changePasswordService(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully!",
    data: result,
  });
});
