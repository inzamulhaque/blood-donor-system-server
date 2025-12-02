import { Server } from "http";
import app from "./app";
import config from "./config/index";
import mongoose from "mongoose";
import seedSuperAndMainAdmin from "./app/DB";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.DATABASE_URL as string);

    seedSuperAndMainAdmin();

    server = app.listen(config.PORT, () => {
      console.log(`http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on("unhandledRejection", () => {
  console.log("unhandledRejection");

  if (server) {
    server.close(() => {
      console.log("Server closed due to unhandledRejection");
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log("uncaughtException");

  if (server) {
    server.close(() => {
      console.log("Server closed due to uncaughtException");
      process.exit(1);
    });
  }

  process.exit(1);
});
