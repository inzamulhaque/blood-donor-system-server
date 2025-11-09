import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { addDonateDateService, addNewDonorService } from "./donor.services";

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

export const adDonateDate = catchAsync(async (req, res) => {
  const trackingNumber = (req.user as any)?.trackingNumber;

  const result = await addDonateDateService(req.body, trackingNumber);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donate date added successfully!",
    data: result,
  });
});
