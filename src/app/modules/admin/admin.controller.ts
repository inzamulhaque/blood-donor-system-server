import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpsStatus from "http-status";
import {
  changeDonorRoleToAdminService,
  getAllDonorService,
  getAllUserService,
} from "./admin.services";

export const getAllUser = catchAsync(async (req, res) => {
  const { query } = req;

  const { meta, result } = await getAllUserService(query);

  sendResponse(res, {
    statusCode: httpsStatus.OK,
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
    statusCode: httpsStatus.OK,
    success: true,
    message: "Donor role changed to admin successfully!",
    data: updatedUser,
  });
});

export const getAllDonor = catchAsync(async (req, res) => {
  const { query } = req;

  const { meta, result } = await getAllDonorService(query);

  sendResponse(res, {
    statusCode: httpsStatus.OK,
    success: true,
    message: "Get all donor successfully!",
    meta: meta,
    data: result,
  });
});
