import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { addNewDonorService } from "./donor.services";

export const addNewDonor = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await addNewDonorService(payload);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Donor added successfully",
    data: result,
  });
});
