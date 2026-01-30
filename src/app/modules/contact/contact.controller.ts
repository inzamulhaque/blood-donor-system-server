import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
  addNewMessageService,
  getAllMessageService,
  getMessageByIdService,
} from "./contact.services";

export const addNewMessage = catchAsync(async (req, res) => {
  const result = await addNewMessageService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message:
      "Your message has been delivered successfully. Thank you for contacting us!",
    data: result,
  });
});

export const getAllMessage = catchAsync(async (req, res) => {
  const { meta, result } = await getAllMessageService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Retrieve all messages!",
    meta: meta,
    data: result,
  });
});

export const getMessageById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getMessageByIdService(id as string);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Get single message by ID!",
    data: result,
  });
});
