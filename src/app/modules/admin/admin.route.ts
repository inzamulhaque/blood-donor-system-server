import express from "express";
import auth from "../../middlewares/auth";
import {
  changeDonorRoleToAdmin,
  getAllDonor,
  getAllUser,
} from "./admin.controller";

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

const AdminRouters = router;

export default AdminRouters;
