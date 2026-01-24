import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
  addDonateDateService,
  addNewDonorService,
  getMyDonateDateListService,
  getTimesDonatedService,
} from "./donor.services";

export const addNewDonor = catchAsync(async (req, res) => {
  const payload = req.body;
  const trackingNumber = (req.user as any)?.trackingNumber;

  const result = await addNewDonorService(payload, trackingNumber);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Donor added successfully",
    data: result,
  });
});

export const adDonateDate = catchAsync(async (req, res) => {
  const trackingNumber = (req.user as any)?.trackingNumber;

  const result = await addDonateDateService(req.body, trackingNumber);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Donate date added successfully!",
    data: result,
  });
});

export const getMyDonateDateList = catchAsync(async (req, res) => {
  const trackingNumber = (req.user as any)?.trackingNumber;
  const result = await getMyDonateDateListService(trackingNumber);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Donate date list fetched successfully!",
    data: result,
  });
});

export const getTimesDonated = catchAsync(async (req, res) => {
  const trackingNumber = (req.user as any)?.trackingNumber;
  const result = await getTimesDonatedService(trackingNumber);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Donate date count fetched successfully!",
    data: result,
  });
});
