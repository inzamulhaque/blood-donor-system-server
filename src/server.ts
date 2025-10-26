import { Server } from "http";
import app from "./app";
import config from "./config/index";
import mongoose from "mongoose";

async function main() {
  try {
    await mongoose.connect(config.DATABASE_URL as string);

    const server: Server = app.listen(config.PORT, () => {
      console.log(`http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
