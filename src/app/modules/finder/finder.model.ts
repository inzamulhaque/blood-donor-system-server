import { model, Schema } from "mongoose";
import type { IFinder } from "./finder.interface";
import { UPOZILAS_PABNA } from "../donor/donor.constant";

const finderSchema = new Schema<IFinder>(
  {
    name: {
      type: String,
      required: [true, "Finder name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Finder email is required"],
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },
    trackingNumber: {
      type: Number,
      required: [true, "Tracking number is required"],
      minlength: 6,
      maxlength: 6,
    },
    upozila: {
      type: String,
      required: [true, "Upozila is required"],
      enum: UPOZILAS_PABNA,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Finder = model<IFinder>("Finder", finderSchema);

export default Finder;
