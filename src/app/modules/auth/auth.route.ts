import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  ChangePasswordValidationSchema,
  SignInValidationSchema,
  VerifyingOtpValidationSchema,
} from "./auth.validation";
import { changePassword, signin, verifyingOtp } from "./auth.controller";
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

const AuthRouters = router;

export default AuthRouters;
