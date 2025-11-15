import { Router } from "express";
import DonorRoutes from "../app/modules/donor/donor.route";
import UserRouters from "../app/modules/user/user.route";
import AuthRouters from "../app/modules/auth/auth.route";
import FinderRouters from "../app/modules/finder/finder.route";
import AdminRouters from "../app/modules/admin/admin.route";

const router = Router();

const moduleRouters = [
  {
    path: "/donors",
    route: DonorRoutes,
  },
  {
    path: "/users",
    route: UserRouters,
  },
  {
    path: "/auth",
    route: AuthRouters,
  },
  {
    path: "/finders",
    route: FinderRouters,
  },
  {
    path: "/admins",
    route: AdminRouters,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));

export default router;
