import Donor from "./donor.model";

export const donorTrackingNumber = async (): Promise<number> => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);

  const existingDonor = await Donor.findOne({ trackingNumber: randomNumber });

  if (existingDonor) {
    return donorTrackingNumber();
  } else {
    return randomNumber;
  }
};
