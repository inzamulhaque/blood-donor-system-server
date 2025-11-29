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
  const randomNumber = Math.floor(10000 + Math.random() * 90000);

  const existingUser = await Otp.findOne({ otp: randomNumber });

  if (existingUser) {
    return otpNumberGenerator();
  } else {
    return randomNumber;
  }
};

export const formateResendOTPEmail = (name: string, otp: number) => {
  return `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>নতুন OTP অনুরোধ</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                color: #333;
            }
            .email-container {
                background-color: #ffffffb5;
                max-width: 600px;
                margin: 20px auto;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                padding: 40px 20px;
                text-align: center;
                color: #ffffff;
                position: relative;
                background: rgba(0, 0, 0, 0.4);
            }
            .header img {
                max-width: 150px;
                border-radius: 5px;
                height: auto;
                display: block;
                margin: 0 auto 15px;
                position: relative;
                z-index: 1;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                position: relative;
                z-index: 1;
            }
            .content {
                padding: 30px;
                line-height: 1.6;
                background: #fff;
            }
            .otp-box {
                background-color: #eee;
                color: #d9534f;
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                padding: 15px;
                margin: 25px 0;
                border-radius: 5px;
                letter-spacing: 3px;
            }
            .footer {
                background-color: #f8f8f8;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #eee;
            }
            .footer a {
                color: #d9534f;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <img src="https://i.ibb.co/Dg18pLFy/al-dima-logo.png" alt="Ihsan Al-Dima Logo">
                <h1>আপনার নতুন OTP</h1>
            </div>
            <div class="content">
                <p>প্রিয় ${name},</p>
                <p>আপনার অনুরোধের প্রেক্ষিতে, একটি নতুন ওয়ান টাইম পাসওয়ার্ড (OTP) নিচে দেওয়া হলো:</p>
                <div class="otp-box">
                    ${otp}
                </div>
                <p>এই OTP টি <strong>৫</strong> মিনিটের জন্য বৈধ। এটি কখনও কারো সাথে শেয়ার করবেন না।</p>
                <p>যদি আপনি এই অনুরোধটি না করে থাকেন, তবে অনুগ্রহ করে এই ইমেইলটি উপেক্ষা করুন।</p>
                <p>শুভেচ্ছান্তে,<br>ইহসান আল-দিমা টিম</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} ইহসান আল-দিমা। সর্বস্বত্ব সংরক্ষিত।</p>
                <p><a href="#">আমাদের ওয়েবসাইট ভিজিট করুন</a></p>
            </div>
        </div>
    </body>
    </html>
  `;
};

export const formateForgetPasswordOTPEmail = (name: string, otp: number) => {
  return `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>পাসওয়ার্ড রিসেট OTP</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                color: #333;
            }
            .email-container {
                background-color: #ffffffb5;
                max-width: 600px;
                margin: 20px auto;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                padding: 40px 20px;
                text-align: center;
                color: #ffffff;
                position: relative;
                background: rgba(0, 0, 0, 0.4);
            }
            .header img {
                max-width: 150px;
                border-radius: 5px;
                height: auto;
                display: block;
                margin: 0 auto 15px;
                position: relative;
                z-index: 1;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                position: relative;
                z-index: 1;
            }
            .content {
                padding: 30px;
                line-height: 1.6;
                background: #fff;
            }
            .otp-box {
                background-color: #eee;
                color: #d9534f;
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                padding: 15px;
                margin: 25px 0;
                border-radius: 5px;
                letter-spacing: 3px;
            }
            .footer {
                background-color: #f8f8f8;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #eee;
            }
            .footer a {
                color: #d9534f;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <img src="https://i.ibb.co/Dg18pLFy/al-dima-logo.png" alt="Ihsan Al-Dima Logo">
                <h1>পাসওয়ার্ড রিসেট করুন</h1>
            </div>
            <div class="content">
                <p>প্রিয় ${name},</p>
                <p>আমরা আপনার ইহসান আল-দিমা অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তনের একটি অনুরোধ পেয়েছি। পাসওয়ার্ড রিসেট সম্পন্ন করতে নিচের ওয়ান টাইম পাসওয়ার্ড (OTP) টি ব্যবহার করুন:</p>
                <div class="otp-box">
                    ${otp}
                </div>
                <p>এই OTP টি <strong>৫</strong> মিনিটের জন্য বৈধ। এটি কারো সাথে শেয়ার করবেন না।</p>
                <p>আপনি যদি পাসওয়ার্ড পরিবর্তনের অনুরোধ না করে থাকেন, তবে দয়া করে এই ইমেইলটি উপেক্ষা করুন। আপনার অ্যাকাউন্ট সুরক্ষিত আছে।</p>
                <p>শুভেচ্ছান্তে,<br>ইহসান আল-দিমা টিম</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} ইহসান আল-দিমা। সর্বস্বত্ব সংরক্ষিত।</p>
                <p><a href="#">আমাদের ওয়েবসাইট ভিজিট করুন</a></p>
            </div>
        </div>
    </body>
    </html>
  `;
};
