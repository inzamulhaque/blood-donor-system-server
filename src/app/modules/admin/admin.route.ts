import express from "express";
import auth from "../../middlewares/auth";
import {
  blockAdmin,
  blockUser,
  changeDonorRoleToAdmin,
  getAllDonor,
  getAllUser,
  getTotalDonorAndFinderCount,
  removeAdmin,
  unblockAdmin,
  unblockUser,
} from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { BlockingUserValidationSchema } from "./admin.validation";

const router = express.Router();

router.get("/all-users", auth("super-admin", "admin"), getAllUser);

router.patch(
  "/change-donor-to-admin",
  auth("super-admin"),
  changeDonorRoleToAdmin
);

router.get("/all-donor", auth("super-admin", "admin"), getAllDonor);

router.patch(
  "/block-user/:trackingNumber",
  auth("super-admin", "admin"),
  validateRequest(BlockingUserValidationSchema),
  blockUser
);

router.patch(
  "/unblock-user/:trackingNumber",
  auth("super-admin", "admin"),
  unblockUser
);

router.patch(
  "/block-admin/:trackingNumber",
  auth("super-admin"),
  validateRequest(BlockingUserValidationSchema),
  blockAdmin
);

router.patch(
  "/unblock-admin/:trackingNumber",
  auth("super-admin"),
  unblockAdmin
);

router.patch("/remove-admin/:trackingNumber", auth("super-admin"), removeAdmin);

router.get(
  "/donor-and-finder-count",
  auth("admin", "super-admin"),
  getTotalDonorAndFinderCount
);

const AdminRouters = router;

export default AdminRouters;
