import { model, Schema } from "mongoose";

import { BLOOD_GROUPS, UPOZILAS_PABNA } from "./donor.constant";
import type { IDonor } from "./donor.interface";

const donorSchema = new Schema<IDonor>(
  {
    name: {
      type: String,
      required: [true, "Donor name is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    },
    bloodGroup: {
      type: String,
      required: [true, "Blood group is required"],
      enum: BLOOD_GROUPS,
    },
    upozila: {
      type: String,
      required: [true, "Upozila is required"],
      enum: UPOZILAS_PABNA,
    },
    addedBy: {
      type: Number,
      ref: "Admin",
    },
    trackingNumber: {
      type: Number,
      required: [true, "Tracking number is required"],
      unique: true,
      minlength: 6,
      maxlength: 6,
    },
    lastDonoteDate: {
      type: Date,
    },
    accountVisibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    accountStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isBlocked: {
      type: Boolean,
      default: false,
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

const Donor = model<IDonor>("Donor", donorSchema);

export default Donor;
