import express from "express";
import auth from "../../middlewares/auth";
import { getAllUser } from "./admin.controller";

const router = express.Router();

router.get(
  "/all-users",
  auth("super-admin", "main-admin", "admin"),
  getAllUser
);

const AdminRouters = router;

export default AdminRouters;
