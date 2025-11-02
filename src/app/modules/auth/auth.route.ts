import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { SignInValidationSchema } from "./auth.validation";
import { signin } from "./auth.controller";

const router = express.Router();

router.post("/signin", validateRequest(SignInValidationSchema), signin);

const AuthRouters = router;

export default AuthRouters;
