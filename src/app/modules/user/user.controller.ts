import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpsStatus from "http-status";
import { createNewDonorService, createNewFinderService } from "./user.services";

export const createNewDonor = catchAsync(async (req, res) => {
  const result = await createNewDonorService(req.body);

  sendResponse(res, {
    statusCode: httpsStatus.CREATED,
    success: true,
    message: "New donor created successfully!",
    data: result,
  });
});

export const createNewFinder = catchAsync(async (req, res) => {
  const result = await createNewFinderService(req.body);

  sendResponse(res, {
    statusCode: httpsStatus.CREATED,
    success: true,
    message: "New finder created successfully!",
    data: result,
  });
});
