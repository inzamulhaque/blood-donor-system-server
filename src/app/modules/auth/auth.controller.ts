import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { signinService } from "./auth.services";

export const signin = catchAsync(async (req, res) => {
  const user = await signinService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Signin successful",
    data: user,
  });
});
