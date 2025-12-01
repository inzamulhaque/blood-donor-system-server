import type mongoose from "mongoose";
import type { IErrorSources, IGenericErrorResponse } from "./error.interface";

const handleValidationError = (
  err: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  const errorSources: IErrorSources[] = Object.values(err.errors).map((el) => {
    return {
      path: el.path,
      message: el.message,
    };
  });

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};

export default handleValidationError;
