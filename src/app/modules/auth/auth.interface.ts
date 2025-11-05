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
