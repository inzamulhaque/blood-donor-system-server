import { Router } from "express";
import DonorRoutes from "../app/modules/donor/donor.route";
import UserRouters from "../app/modules/user/user.route";

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
];

moduleRouters.forEach((route) => router.use(route.path, route.route));

export default router;
