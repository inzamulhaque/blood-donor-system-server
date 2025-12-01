import type mongoose from "mongoose";
import type { IErrorSources, IGenericErrorResponse } from "./error.interface";

const handleCastError = (
  err: mongoose.Error.CastError
): IGenericErrorResponse => {
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

export default handleCastError;
