import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import {
  blockUserService,
  changeDonorRoleToAdminService,
  getAllDonorService,
  getAllUserService,
} from "./admin.services";

export const getAllUser = catchAsync(async (req, res) => {
  const { query } = req;

  const { meta, result } = await getAllUserService(query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get all user successfully!",
    meta,
    data: result,
  });
});

export const changeDonorRoleToAdmin = catchAsync(async (req, res) => {
  const { email } = req.query;

  const updatedUser = await changeDonorRoleToAdminService(email as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Donor role changed to admin successfully!",
    data: updatedUser,
  });
});

export const getAllDonor = catchAsync(async (req, res) => {
  const { query } = req;

  const { meta, result } = await getAllDonorService(query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get all donor successfully!",
    meta: meta,
    data: result,
  });
});

export const blockUser = catchAsync(async (req, res) => {
  const { trackingNumber } = req.params;
  const { reason } = req.body;
  const adminTrackingNumber = req.user?.trackingNumber;

  const result = await blockUserService(
    Number(trackingNumber),
    Number(adminTrackingNumber),
    reason
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User blocked successfully!",
    data: result,
  });
});
