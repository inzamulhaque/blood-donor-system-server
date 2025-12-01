import type { IErrorSources, IGenericErrorResponse } from "./error.interface";

const handleDuplicateError = (err: unknown): IGenericErrorResponse => {
  // @ts-ignore
  const errorMsg = err?.message || err?.errmsg;
  const match = errorMsg.match(/"([^"]*)"/);

  const extractedMessage = match && match[1];
  const errorSources: IErrorSources[] = [
    {
      path: "",
      message: `${extractedMessage} is already exists`,
    },
  ];

  return {
    statusCode: 409,
    message: "Duplicate Field Value Entered",
    errorSources,
  };
};

export default handleDuplicateError;
