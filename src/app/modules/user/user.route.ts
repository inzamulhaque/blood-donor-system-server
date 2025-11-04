import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidationSchema } from "./user.validation";
import { createNewDonor, createNewFinder, getMe } from "./user.controller";
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

const UserRouters = router;

export default UserRouters;
