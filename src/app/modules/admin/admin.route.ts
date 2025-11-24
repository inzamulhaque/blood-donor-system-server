import express from "express";
import auth from "../../middlewares/auth";
import { getAllDonor, getAllUser } from "./admin.controller";

const router = express.Router();

router.get(
  "/all-users",
  auth("super-admin", "main-admin", "admin"),
  getAllUser
);

router.get(
  "/all-donor",
  auth("super-admin", "main-admin", "admin"),
  getAllDonor
);

const AdminRouters = router;

export default AdminRouters;
