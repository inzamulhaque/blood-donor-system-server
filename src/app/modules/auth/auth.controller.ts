import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import {
  changePasswordService,
  forgotPasswordService,
  resendOtpService,
  resetPasswordService,
  signinService,
  verifyingOtpService,
} from "./auth.services";
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
    statusCode: 200,
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
    statusCode: 200,
    success: true,
    message: "Password changed successfully!",
    data: result,
  });
});

export const verifyingOtp = catchAsync(async (req, res) => {
  const { trackingNumber } = req.params;
  const { otp } = req.body;

  const result = await verifyingOtpService(Number(trackingNumber), otp);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP verified successfully!",
    data: result,
  });
});

export const resendOtp = catchAsync(async (req, res) => {
  const { trackingNumber } = req.params;

  const result = await resendOtpService(Number(trackingNumber));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP resent successfully!",
    data: result,
  });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const result = await forgotPasswordService(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password reset OTP sent successfully!",
    data: result,
  });
});

export const resetPassword = catchAsync(async (req, res) => {
  const { trackingNumber } = req.params;
  const { newPassword, otp } = req.body;

  const result = await resetPasswordService(
    Number(trackingNumber),
    otp,
    newPassword
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password reset successfully!",
    data: result,
  });
});
