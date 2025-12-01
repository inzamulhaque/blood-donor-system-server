import type mongoose from "mongoose";
import type { IErrorSources } from "./error.interface";

const handleValidationError = (err: mongoose.Error.ValidationError) => {
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
