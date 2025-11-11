import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  UpdateUserValidationSchema,
  UserValidationSchema,
} from "./user.validation";
import {
  createNewDonor,
  createNewFinder,
  getMe,
  updateUser,
} from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/new-donor",
  validateRequest(UserValidationSchema),
  createNewDonor
);

router.post(
  "/new-finder",
  validateRequest(UserValidationSchema),
  createNewFinder
);

router.get(
  "/me",
  auth("super-admin", "main-admin", "admin", "donor", "finder"),
  getMe
);

router.patch(
  "/update",
  auth("admin", "donor", "finder"),
  validateRequest(UpdateUserValidationSchema),
  updateUser
);

const UserRouters = router;

export default UserRouters;
