export interface ISignin {
  email: string;
  password: string;
}

export interface IOldPassword {
  oldPassword: string;
  trackingNumber: string;
}

export interface IOTPVerification {
  otp: string;
  trackingNumber: number;
}

export interface IOtp {
  otp: number;
  trackingNumber: number;
  otpFor: "account-activation" | "password-reset";
  createdAt?: Date;
}
