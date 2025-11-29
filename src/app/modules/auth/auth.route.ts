import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  ChangePasswordValidationSchema,
  ForgotPasswordvalidationSchema,
  ResetPasswordValidationSchema,
  SignInValidationSchema,
  VerifyingOtpValidationSchema,
} from "./auth.validation";
import {
  changePassword,
  forgotPassword,
  resendOtp,
  resetPassword,
  signin,
  verifyingOtp,
} from "./auth.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/signin", validateRequest(SignInValidationSchema), signin);

router.patch(
  "/change-password",
  auth("super-admin", "main-admin", "admin", "donor", "finder"),
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

router.post(
  "/reset-password/:trackingNumber",
  validateRequest(ResetPasswordValidationSchema),
  resetPassword
);

const AuthRouters = router;

export default AuthRouters;
