import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpsStatus from "http-status";
import {
  changeFinderToDonorService,
  findDonorService,
} from "./finder.services";
import type { JwtPayload } from "jsonwebtoken";

export const findDonor = catchAsync(async (req, res) => {
  const result = await findDonorService(req.body);

  sendResponse(res, {
    statusCode: httpsStatus.OK,
    success: true,
    message: "Donor found successfully!",
    data: result,
  });
});

export const changeFinderToDonor = catchAsync(async (req: JwtPayload, res) => {
  const { trackingNumber } = req.user;
  const { bloodGroup } = req.body;
  const result = await changeFinderToDonorService(trackingNumber, bloodGroup);

  sendResponse(res, {
    statusCode: httpsStatus.OK,
    success: true,
    message: "Finder changed to Donor successfully!",
    data: result,
  });
});
