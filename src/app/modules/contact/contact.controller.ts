import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { addNewMessageService } from "./contact.services";

export const addNewMessage = catchAsync(async (req, res) => {
  const result = await addNewMessageService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Send message successfully!",
    data: result,
  });
});
