import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  FindDonorValidationSchema,
  FinderToDonorValidationSchema,
} from "./finder.validation";
import { changeFinderToDonor, findDonor } from "./finder.controller";

const router = express.Router();

router.get(
  "/find-donor",
  auth("donor", "finder"),
  validateRequest(FindDonorValidationSchema),
  findDonor
);

router.patch(
  "/finder-to-donor",
  auth("finder"),
  validateRequest(FinderToDonorValidationSchema),
  changeFinderToDonor
);

const FinderRouters = router;

export default FinderRouters;
