import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes";
import cron from "node-cron";
import { updateAvailabilityByDate } from "./app/modules/donor/donor.utils";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

app.use(cors({ origin: ["http://localhost:5173/"], credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cron.schedule("0 0 */12 * * *", () => {
  updateAvailabilityByDate();
});

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is blood donor management system server!",
    success: true,
    statusCode: 200,
  });
});

// api not found
app.use(notFound);

// global error handler
app.use(globalErrorHandler);

export default app;
