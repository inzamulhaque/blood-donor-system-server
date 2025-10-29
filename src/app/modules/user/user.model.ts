import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import type { IUser } from "./user.interface";
import { blockStatusSchema } from "../donor/donor.model";
import { roles } from "./user.constant";
import config from "../../../config";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    trackingNumber: {
      type: Number,
      required: [true, "Tracking number is required"],
      unique: true,
      minlength: 6,
      maxlength: 6,
    },
    role: {
      type: String,
      enum: roles,
      required: [true, "User role is required"],
      default: "donor",
    },

    accountStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
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

userSchema.pre("save", async function (next) {
  const user = this;

  user.password = await bcrypt.hash(user.password, config.BCRYPT_SALT_ROUNDS);

  next();
});

const User = model<IUser>("User", userSchema);

export default User;
