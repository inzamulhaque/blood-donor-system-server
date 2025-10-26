import { Router } from "express";
import DonorRoutes from "../app/modules/donor/donor.route";

const router = Router();

const moduleRouters = [
  {
    path: "/donors",
    route: DonorRoutes,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));

export default router;
