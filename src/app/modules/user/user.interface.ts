import type { IBlockStatus } from "../donor/donor.interface";
import type { roles } from "./user.constant";

export interface IUser {
  name: string;
  email: string;
  password: string;
  trackingNumber: number;
  role: TUserRole;
  accountVisibility?: "public" | "private";
  accountStatus?: "active" | "inactive";
  blockStatus?: IBlockStatus;
  isDeleted?: boolean;
}

export type TUserRole = (typeof roles)[number];
