import { model, Schema } from "mongoose";
import type { IOldPassword, IOtp } from "./auth.interface";

const oldPasswordSchema = new Schema<IOldPassword>(
  {
    oldPassword: {
      type: String,
      required: true,
    },
    trackingNumber: {
      type: String,
      unique: false,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const otpSchema = new Schema<IOtp>(
  {
    otp: {
      type: Number,
      required: true,
      unique: false,
      min: 10000,
      max: 99999,
    },

    trackingNumber: {
      type: Number,
      required: true,
      unique: true,
      ref: "User",
    },

    otpFor: {
      type: String,
      required: true,
      enum: ["account-activation", "password-reset"],
    },
  },
  {
    timestamps: true,
  }
);

export const OldPassword = model<IOldPassword>(
  "OldPassword",
  oldPasswordSchema
);

export const Otp = model<IOtp>("Otp", otpSchema);
