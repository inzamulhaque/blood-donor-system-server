import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import type { IMessage } from "./contact.interface";
import Contact from "./contact.modal";

export const addNewMessageService = async (payload: IMessage) => {
  const message = await Contact.create(payload);
  return message;
};

export const getAllMessageService = async (query: Record<string, unknown>) => {
  const messages = new QueryBuilder(Contact.find(), {
    ...query,
    sort: "isReaded",
  })
    .paginate()
    .sort();

  const result = await messages.modelQuery;
  const meta = await messages.countTotal();

  return { meta, result };
};

export const getMessageByIdService = async (id: string) => {
  const message = await Contact.findById(id);

  if (!message) {
    new AppError(404, "Message not found!");
  }

  if (!message?.isReaded) {
    await Contact.findByIdAndUpdate(id, {
      $set: { isReaded: true },
    });
  }

  return message;
};
