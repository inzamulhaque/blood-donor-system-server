import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpsStatus from "http-status";
import { findDonorService } from "./finder.services";

export const findDonor = catchAsync(async (req, res) => {
  const result = await findDonorService(req.body);

  sendResponse(res, {
    statusCode: httpsStatus.OK,
    success: true,
    message: "Donor found successfully!",
    data: result,
  });
});
