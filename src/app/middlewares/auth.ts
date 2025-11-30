import type { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../errors/AppError";
import { verifyToken } from "../modules/auth/auth.utils";
import type { TUserRole } from "../modules/user/user.interface";
import User from "../modules/user/user.model";
import catchAsync from "../utils/catchAsync";

// augment Express Request type to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const auth = (...requiredRoles: TUserRole[]) =>
  catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(401, "You are not authorized!");
    }

    const decoded = verifyToken(token, config.JWT_ACCESS_SECRET);

    if (!decoded) {
      throw new AppError(401, "You are not authorized!");
    }

    const { trackingNumber, role } = decoded;

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(401, "You are not authorized!");
    }

    const user = await User.findOne({ trackingNumber, role });

    if (!user) {
      throw new AppError(401, "This user is not found!");
    }

    const isDeleted = user?.isDeleted;

    if (isDeleted) {
      throw new AppError(403, "This user is deleted!");
    }

    const isBlocked = user?.blockStatus?.isBlocked;

    if (isBlocked) {
      throw new AppError(403, "This user is blocked!");
    }

    req.user = decoded as JwtPayload;

    next();
  });

export default auth;
