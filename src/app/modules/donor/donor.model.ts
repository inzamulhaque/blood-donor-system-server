import { model, Schema } from "mongoose";

import { BLOOD_GROUPS, UPOZILAS_PABNA } from "./donor.constant";
import type { IBlockStatus, IDonor } from "./donor.interface";

export const blockStatusSchema = new Schema<IBlockStatus>(
  {
    isBlocked: {
      type: Boolean,
      required: true,
      default: false,
    },
    blockReason: {
      type: String,
    },

    blockedBy: {
      type: Number,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

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
      unique: true,
      minlength: 6,
      maxlength: 6,
      ref: "User",
    },
    lastDonoteDate: {
      type: Date,
    },
    accountVisibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    availability: {
      type: Boolean,
      default: true,
    },
    blockStatus: {
      type: blockStatusSchema,
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
