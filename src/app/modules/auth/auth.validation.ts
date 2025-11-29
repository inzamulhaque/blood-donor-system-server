import z from "zod";

export const SignInValidationSchema = z.object({
  body: z.object({
    email: z.templateLiteral([z.string().min(1), "@", z.string().max(64)]),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(18, "Password must be at most 18 characters long"),
  }),
});

export const ChangePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z
      .string()
      .min(6, "Old password must be at least 6 characters long"),
    newPassword: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(18, { message: "Password must not exceed 18 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,18}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }
      ),
  }),
});

export const VerifyingOtpValidationSchema = z.object({
  body: z.object({
    otp: z.number({ message: "OTP is required" }),
  }),
});

export const ForgotPasswordvalidationSchema = z.object({
  body: z.object({
    email: z.templateLiteral([z.string().min(1), "@", z.string().max(64)]),
  }),
});

export const ResetPasswordValidationSchema = z.object({
  body: z.object({
    otp: z.number({ message: "OTP is required" }),

    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(18, { message: "Password must not exceed 18 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,18}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }
      ),
  }),
});
