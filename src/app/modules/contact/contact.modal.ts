import { model, Schema } from "mongoose";
import type { IMessage } from "./contact.interface";

const contactSchema = new Schema<IMessage>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be at most 50 characters"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: false,
    },

    subject: {
      type: String,
      required: [true, "Subject is required"],
      minlength: [3, "Subject must be at least 3 characters"],
      trim: true,
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      maxlength: [150, "Message must not exceed 150 characters"],
      trim: true,
    },

    isReaded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Contact = model<IMessage>("Contact", contactSchema);

export default Contact;
