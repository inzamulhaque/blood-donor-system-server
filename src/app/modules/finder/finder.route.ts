import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { FindDonorValidationSchema } from "./finder.validation";
import { findDonor } from "./finder.controller";

const router = express.Router();

router.get(
  "/find-donor",
  auth("donor", "finder"),
  validateRequest(FindDonorValidationSchema),
  findDonor
);

const FinderRouters = router;

export default FinderRouters;
