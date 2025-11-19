import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpsStatus from "http-status";
import { getAllUserService } from "./admin.services";

export const getAllUser = catchAsync(async (req, res) => {
  const { query } = req;

  const result = await getAllUserService(query);

  sendResponse(res, {
    statusCode: httpsStatus.OK,
    success: true,
    message: "Get all user successfully!",
    data: result,
  });
});
