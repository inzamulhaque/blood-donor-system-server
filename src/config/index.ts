import * as dotenv from "dotenv";
import * as path from "path";

declare const process: any;

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 7000,
  DATABASE_URL: process.env.DATABASE_URL,
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  SUPER_ADMIN: {
    name: process.env.SUPER_ADMIN_NAME,
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
    role: process.env.SUPER_ADMIN_ROLE,
    trackingNumber: process.env.SUPER_ADMIN_TRACKING_NUMBER,
  },

  MAIN_ADMIN: {
    name: process.env.MAIN_ADMIN_NAME,
    email: process.env.MAIN_ADMIN_EMAIL,
    password: process.env.MAIN_ADMIN_PASSWORD,
    role: process.env.MAIN_ADMIN_ROLE,
    trackingNumber: process.env.MAIN_ADMIN_TRACKING_NUMBER,
  },

  EMAIL: {
    address: process.env.EMAIL_ADDRESS,
    password: process.env.EMAIL_PASSWORD,
  },
};
