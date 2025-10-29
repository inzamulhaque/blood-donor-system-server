import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidationSchema } from "./user.validation";
import { createNewDonor } from "./user.controller";

const router = express.Router();

router.post(
  "/new-donor",
  validateRequest(UserValidationSchema),
  createNewDonor
);

const UserRouters = router;

export default UserRouters;
