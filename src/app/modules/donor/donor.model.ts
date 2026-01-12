import { model, Schema } from "mongoose";

import { BLOOD_GROUPS, UPOZILAS_PABNA } from "./donor.constant";
import type { IDonateDate, IDonor } from "./donor.interface";

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
      ref: "User",
    },
    trackingNumber: {
      type: Number,
      unique: true,
      minlength: 6,
      maxlength: 6,
      sparse: true,
    },
    lastDonateDate: {
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

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const donateDateSchema = new Schema<IDonateDate>(
  {
    date: {
      type: Date,
      required: [true, "Donation date is required"],
    },
    donorId: {
      type: Schema.Types.ObjectId,
      ref: "Donor",
      required: [true, "Donor ID is required"],
    },
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Donor = model<IDonor>("Donor", donorSchema);
export const DonateDate = model<IDonateDate>("DonateDate", donateDateSchema);

export default Donor;
