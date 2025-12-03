import config from "../../config";
import User from "../modules/user/user.model";

const seedSuperAdmin = async () => {
  const isSuperAdminExits = await User.findOne({ role: "super-admin" });

  if (!isSuperAdminExits) {
    await User.create({ ...config.SUPER_ADMIN, accountStatus: "active" });
  }
};

export default seedSuperAdmin;
