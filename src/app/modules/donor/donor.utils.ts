import Donor from "./donor.model";

export const updateAvailabilityByDate = async () => {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  await Donor.updateMany(
    {
      lastDonateDate: { $lte: ninetyDaysAgo },
      isDeleted: false,
    },
    {
      $set: {
        availability: true,
      },
    }
  );
};
