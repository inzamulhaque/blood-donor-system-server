import config from "../../config";
import User from "../modules/user/user.model";

const seedSuperAndMainAdmin = async () => {
  const isSuperAdminExits = await User.findOne({ role: "super-admin" });

  const isMainAdminExits = await User.findOne({ role: "main-admin" });

  if (!isSuperAdminExits) {
    await User.create({ ...config.SUPER_ADMIN, accountStatus: "active" });
  }

  if (!isMainAdminExits) {
    await User.create({ ...config.MAIN_ADMIN, accountStatus: "active" });
  }
};

export default seedSuperAndMainAdmin;
