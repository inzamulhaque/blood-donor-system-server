import type { TUpozila } from "../donor/donor.interface";

export interface IFinder {
  name: string;
  email: string;
  phoneNumber: string;
  trackingNumber: number;
  upozila: TUpozila;
  isDeleted: boolean;
}
