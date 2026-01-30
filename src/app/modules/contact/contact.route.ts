import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ContactValidationSchema } from "./contact.validation";
import {
  addNewMessage,
  getAllMessage,
  getMessageById,
} from "./contact.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/send-message",
  validateRequest(ContactValidationSchema),
  addNewMessage,
);

router.get("/all-messages", auth("super-admin", "admin"), getAllMessage);

router.get("/message/:id", auth("super-admin", "admin"), getMessageById);

const ContactRoutes = router;
export default ContactRoutes;
