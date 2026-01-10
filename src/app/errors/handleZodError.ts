import type { ZodError } from "zod";
import type { IErrorSources, IGenericErrorResponse } from "./error.interface";

const handleZodError = (err: ZodError): IGenericErrorResponse => {
  // @ts-ignore
  const errorSources: IErrorSources[] = err.issues.map((issue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};

export default handleZodError;
