import type mongoose from "mongoose";
import type { IErrorSources } from "./error.interface";

const handleCastError = (err: mongoose.Error.CastError) => {
  const errorSources: IErrorSources[] = [
    {
      path: err?.path,
      message: err?.message,
    },
  ];

  return {
    statusCode: 400,
    message: "Invalid Id",
    errorSources,
  };
};
