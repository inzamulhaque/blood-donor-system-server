export interface IMessage {
  name: string;
  email: string;
  phoneNumber?: string;
  subject: string;
  message: string;
  isReaded?: boolean;
}
