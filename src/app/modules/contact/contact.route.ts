import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ContactValidationSchema } from "./contact.validation";
import { addNewMessage } from "./contact.controller";

const router = express.Router();

router.post(
  "/send-message",
  validateRequest(ContactValidationSchema),
  addNewMessage,
);

const ContactRoutes = router;
export default ContactRoutes;
