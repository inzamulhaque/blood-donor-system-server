import express from "express";
import auth from "../../middlewares/auth";
import {
  blockUser,
  changeDonorRoleToAdmin,
  getAllDonor,
  getAllUser,
} from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { BlockingUserValidationSchema } from "./admin.validation";

const router = express.Router();

router.get(
  "/all-users",
  auth("super-admin", "main-admin", "admin"),
  getAllUser
);

router.patch(
  "/change-donor-to-admin",
  auth("super-admin", "main-admin"),
  changeDonorRoleToAdmin
);

router.get(
  "/all-donor",
  auth("super-admin", "main-admin", "admin"),
  getAllDonor
);

router.patch(
  "/block-user/:trackingNumber",
  auth("super-admin", "main-admin", "admin"),
  validateRequest(BlockingUserValidationSchema),
  blockUser
);

const AdminRouters = router;

export default AdminRouters;
