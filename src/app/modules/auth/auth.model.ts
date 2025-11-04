import { model, Schema } from "mongoose";
import type { IOldPassword } from "./auth.interface";

const oldPasswordSchema = new Schema<IOldPassword>(
  {
    oldPassword: {
      type: String,
      required: true,
    },
    trackingNumber: {
      type: String,
      required: true,
      ref: "User",
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
