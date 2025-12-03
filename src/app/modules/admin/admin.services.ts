import AppError from "../../errors/AppError";

import User from "../user/user.model";
import QueryBuilder from "../../builder/QueryBuilder";
import Donor from "../donor/donor.model";

export const getAllUserService = async (query: Record<string, unknown>) => {
  const users = new QueryBuilder(User.find(), query)
    .search(["name"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await users.modelQuery;

  const meta = await users.countTotal();

  return { meta, result };
};

export const changeDonorRoleToAdminService = async (userEmail: string) => {
  const user = await User.findOne({ email: userEmail });

  if (!user) {
    throw new AppError(404, "User not found!");
  }

  if (user.role !== "donor") {
    throw new AppError(400, "Only donor role can be changed to admin!");
  }

  const updated = await user.updateOne(
    { $set: { role: "admin" } },
    { new: true }
  );

  return updated;
};

export const getAllDonorService = async (query: Record<string, unknown>) => {
  const donor = new QueryBuilder(Donor.find(), query)
    .search(["name"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await donor.modelQuery;
  const meta = await donor.countTotal();

  return { meta, result };
};

export const blockUserService = async (
  trackingNumber: number,
  adminTrackingNumber: number,
  reason: string
) => {
  const user = await User.findOne({ trackingNumber });

  if (!user) {
    throw new AppError(404, "User not found!");
  }

  if (
    user.role === "super-admin" ||
    user.role === "main-admin" ||
    user?.role === "admin"
  ) {
    throw new AppError(400, "You cannot block an admin user!");
  }

  const admin = await User.findOne({ trackingNumber: adminTrackingNumber });

  if (!admin) {
    throw new AppError(404, "Admin not found!");
  }

  const blockUser = await user.updateOne({
    $set: {
      blockStatus: {
        isBlocked: true,
        blockedBy: admin.trackingNumber,
        blockReason: reason,
      },
    },
  });

  return blockUser;
};
