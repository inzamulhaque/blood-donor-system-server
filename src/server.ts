import { Server } from "http";
import app from "./app";
import config from "./config/index";

async function main() {
  const server: Server = app.listen(config.PORT, () => {
    console.log(`http://localhost:${config.PORT}`);
  });
}

main();
