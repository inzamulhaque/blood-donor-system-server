import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  DonateDateValidationSchema,
  DonorValidationSchema,
} from "./donor.validation";
import {
  addNewDonor,
  adDonateDate,
  getMyDonateDateList,
} from "./donor.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/add-donor",
  auth("super-admin", "admin"),
  validateRequest(DonorValidationSchema),
  addNewDonor
);

router.post(
  "/donate-date",
  auth("admin", "donor"),
  validateRequest(DonateDateValidationSchema),
  adDonateDate
);

router.get("/donate-date", auth("admin", "donor"), getMyDonateDateList);

const DonorRoutes = router;
export default DonorRoutes;
