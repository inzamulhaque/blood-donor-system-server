import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidationSchema } from "./user.validation";
import { createNewDonor, createNewFinder } from "./user.controller";

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

const UserRouters = router;

export default UserRouters;
