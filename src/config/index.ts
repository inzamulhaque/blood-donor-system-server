import * as dotenv from "dotenv";
import * as path from "path";

declare const process: any;

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  PORT: process.env.PORT || 7000,
};
