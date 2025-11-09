import type { Date, ObjectId } from "mongoose";
import type { BLOOD_GROUPS, UPOZILAS_PABNA } from "./donor.constant";

export interface IDonor {
  name: string;
  email?: string;
  phoneNumber: string;
  bloodGroup: TBloodGroup;
  upozila: TUpozila;
  addedBy?: number;
  trackingNumber: number;
  lastDonoteDate?: Date;
  accountVisibility?: "public" | "private";
  availability?: boolean;
  isDeleted?: boolean;
}

export interface IDonateDate {
  date: Date;
  donorId: ObjectId;
  note: string;
}

export type TBloodGroup = (typeof BLOOD_GROUPS)[number];
export type TUpozila = (typeof UPOZILAS_PABNA)[number];
