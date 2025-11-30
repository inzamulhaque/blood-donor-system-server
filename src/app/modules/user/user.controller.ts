import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import {
  createNewDonorService,
  createNewFinderService,
  getMeService,
  updateUserService,
} from "./user.services";
import type { JwtPayload } from "jsonwebtoken";

export const createNewDonor = catchAsync(async (req, res) => {
  const result = await createNewDonorService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "New donor created successfully!",
    data: result,
  });
});

export const createNewFinder = catchAsync(async (req, res) => {
  const result = await createNewFinderService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "New finder created successfully!",
    data: result,
  });
});

export const getMe = catchAsync(async (req, res) => {
  const user = req?.user;

  const result = await getMeService(user as JwtPayload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get my information successfully!",
    data: result,
  });
});

export const updateUser = catchAsync(async (req, res) => {
  const { trackingNumber } = req?.user as JwtPayload & {
    trackingNumber?: number;
  };

  const result = await updateUserService(req.body, trackingNumber!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Update my information successfully!",
    data: result,
  });
});
