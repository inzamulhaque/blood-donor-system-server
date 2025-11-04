import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpsStatus from "http-status";
import {
  createNewDonorService,
  createNewFinderService,
  getMeService,
} from "./user.services";
import type { JwtPayload } from "jsonwebtoken";

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

export const getMe = catchAsync(async (req, res) => {
  const user = req?.user;

  const result = await getMeService(user as JwtPayload);

  sendResponse(res, {
    statusCode: httpsStatus.OK,
    success: true,
    message: "Get my information successfully!",
    data: result,
  });
});
