import type { IMessage } from "./contact.interface";
import Contact from "./contact.modal";

export const addNewMessageService = async (payload: IMessage) => {
  const message = await Contact.create(payload);
  return message;
};
