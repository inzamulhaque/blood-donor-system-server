import User from "./user.model";

export const UserTrackingNumber = async (): Promise<number> => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);

  const existingUser = await User.findOne({ trackingNumber: randomNumber });

  if (existingUser) {
    return UserTrackingNumber();
  } else {
    return randomNumber;
  }
};
