import * as jwt from "jsonwebtoken";
import { Otp } from "./auth.model";

export const createToken = (
  jwtPayload: { trackingNumber: number; role: string },
  secretKey: jwt.Secret,
  expiresIn?: string
): string => {
  return jwt.sign(jwtPayload as jwt.JwtPayload, secretKey, {
    expiresIn: expiresIn || "1d",
  } as jwt.SignOptions);
};

export const verifyToken = (token: string, secret: jwt.Secret) => {
  return jwt.verify(token, secret) as jwt.JwtPayload;
};

export const otpNumberGenerator = async (): Promise<number> => {
  const randomNumber = Math.floor(10000 + Math.random() * 900000);

  const existingUser = await Otp.findOne({ otp: randomNumber });

  if (existingUser) {
    return otpNumberGenerator();
  } else {
    return randomNumber;
  }
};
