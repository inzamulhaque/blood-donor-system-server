import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { DonorValidationSchema } from "./donor.validation";
import { addNewDonor } from "./donor.controller";

const router = express.Router();

router.post("/add-donor", validateRequest(DonorValidationSchema), addNewDonor);

const DonorRoutes = router;
export default DonorRoutes;
