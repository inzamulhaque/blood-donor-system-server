import type { TUpozila } from "../donor/donor.interface";

export interface IFinder {
  name: string;
  email: string;
  phone: string;
  trackingNumber: number;
  upozila: TUpozila;
}
