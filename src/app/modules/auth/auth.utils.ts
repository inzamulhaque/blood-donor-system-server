import * as jwt from "jsonwebtoken";

export const createToken = (
  jwtPayload: { trackingNumber: number; role: string },
  secretKey: jwt.Secret,
  expiresIn?: string
): string => {
  return jwt.sign(jwtPayload as jwt.JwtPayload, secretKey, {
    expiresIn: expiresIn || "1d",
  } as jwt.SignOptions);
};
