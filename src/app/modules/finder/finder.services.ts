import type { TBloodGroup, TUpozila } from "../donor/donor.interface";
import Donor from "../donor/donor.model";

export const findDonorService = async (payload: {
  bloodGroup: TBloodGroup;
  upozila: TUpozila;
}) => {
  const donors = await Donor.find({
    bloodGroup: payload.bloodGroup,
    upozila: payload.upozila,
    accountVisibility: "public",
    availability: true,
    isDeleted: false,
  });

  return donors;
};
