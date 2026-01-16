import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  ChangePasswordValidationSchema,
  ForgotPasswordvalidationSchema,
  RefreshTokenValidationSchema,
  ResetPasswordValidationSchema,
  SignInValidationSchema,
  VerifyingOtpValidationSchema,
} from "./auth.validation";
import {
  changePassword,
  forgotPassword,
  refreshToken,
  resendOtp,
  resetPassword,
  signin,
  signout,
  verifyingOtp,
} from "./auth.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/signin", validateRequest(SignInValidationSchema), signin);

router.post("/signout", signout);

router.patch(
  "/change-password",
  auth("super-admin", "admin", "donor", "finder"),
  validateRequest(ChangePasswordValidationSchema),
  changePassword
);

router.post(
  "/verify-otp/:trackingNumber",
  validateRequest(VerifyingOtpValidationSchema),
  verifyingOtp
);

router.post("/resend-otp/:trackingNumber", resendOtp);

router.post(
  "/forgot-password",
  validateRequest(ForgotPasswordvalidationSchema),
  forgotPassword
);

router.patch(
  "/reset-password/:trackingNumber",
  validateRequest(ResetPasswordValidationSchema),
  resetPassword
);

router.post(
  "/refresh-token",
  validateRequest(RefreshTokenValidationSchema),
  refreshToken
);

const AuthRouters = router;

export default AuthRouters;
