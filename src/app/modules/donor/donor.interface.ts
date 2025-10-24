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
  accountStatus?: "active" | "inactive";
  isBlocked?: boolean;
  isDeleted?: boolean;
}

export type TBloodGroup = (typeof BLOOD_GROUPS)[number];
export type TUpozila = (typeof UPOZILAS_PABNA)[number];
