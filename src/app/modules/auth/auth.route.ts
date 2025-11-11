import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  ChangePasswordValidationSchema,
  SignInValidationSchema,
} from "./auth.validation";
import { changePassword, signin } from "./auth.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/signin", validateRequest(SignInValidationSchema), signin);

router.patch(
  "/change-password",
  auth("super-admin", "main-admin", "admin", "donor", "finder"),
  validateRequest(ChangePasswordValidationSchema),
  changePassword
);

const AuthRouters = router;

export default AuthRouters;
