import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import {
  blockAdminService,
  blockUserService,
  changeDonorRoleToAdminService,
  getAllDonorService,
  getAllUserService,
  getDonorCountByBloodGroupService,
  getTotalAdminCountService,
  getTotalDonorAndFinderCountService,
  removeAdminService,
  unblockAdminService,
  unblockUserService,
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

export const unblockUser = catchAsync(async (req, res) => {
  const { trackingNumber } = req.params;

  const result = await unblockUserService(Number(trackingNumber));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User unblocked successfully!",
    data: result,
  });
});

export const blockAdmin = catchAsync(async (req, res) => {
  const { trackingNumber } = req.params;
  const { reason } = req.body;
  const superAdminTrackingNumber = req.user?.trackingNumber;

  const result = await blockAdminService(
    Number(trackingNumber),
    Number(superAdminTrackingNumber),
    reason
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin blocked successfully!",
    data: result,
  });
});

export const unblockAdmin = catchAsync(async (req, res) => {
  const { trackingNumber } = req.params;

  const result = await unblockAdminService(Number(trackingNumber));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin unblocked successfully!",
    data: result,
  });
});

export const removeAdmin = catchAsync(async (req, res) => {
  const { trackingNumber } = req.params;

  const result = await removeAdminService(Number(trackingNumber));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin removed successfully!",
    data: result,
  });
});

export const getTotalDonorAndFinderCount = catchAsync(async (req, res) => {
  const result = await getTotalDonorAndFinderCountService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Total donor and finder count retrieved successfully!",
    data: result,
  });
});

export const getTotalAdminCount = catchAsync(async (req, res) => {
  const result = await getTotalAdminCountService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Total admin count retrieved successfully!",
    data: result,
  });
});

export const getDonorCountByBloodGroup = catchAsync(async (req, res) => {
  const result = await getDonorCountByBloodGroupService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Donor count by blood group retrieved successfully!",
    data: result,
  });
});
