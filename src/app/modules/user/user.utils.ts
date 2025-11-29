import sendEmail from "../../utils/sendEmail";
import User from "./user.model";

export const UserTrackingNumber = async (): Promise<number> => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);

  const existingUser = await User.findOne({ trackingNumber: randomNumber });

  if (existingUser) {
    return UserTrackingNumber();
  } else {
    return randomNumber;
  }
};

export const formateAccActivationEmail = (name: string, otp: number) => {
  return `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>অ্যাকাউন্ট সক্রিয়করণ OTP</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                color: #333;
            }
            .email-container {
                background-image: url('https://i.ibb.co.com/J1pgCCw/emailBG.png'); 
                background-size: cover;
                background-position: center;
                max-width: 600px;
                margin: 20px auto;
                // background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                // background-image: url('https://i.ibb.co.com/J1pgCCw/emailBG.png'); 
                // background-size: cover;
                // background-position: center;
                padding: 40px 20px;
                text-align: center;
                color: #000000;
                position: relative;
            }
            .header::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.4); /* Dark overlay for text readability */
            }
            .header img {
                max-width: 150px;
                height: auto;
                display: block;
                margin: 0 auto 15px;
                position: relative; /* Bring image above overlay */
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
                <img src="https://i.ibb.co.com/Dg18pLFy/al-dima-logo.png" alt="Ihsan Al-Dima Logo"> <h1 style="color: #ffffff;">আপনার ডোনার অ্যাকাউন্ট সক্রিয় করুন</h1>
            </div>
            <div class="content">
                <p>প্রিয় ${name},</p>
                <p>ইহসান আল-দিমা-তে আপনার অ্যাকাউন্ট সক্রিয় করতে নিচের ওয়ান টাইম পাসওয়ার্ড (OTP) ব্যবহার করুন:</p>
                <div class="otp-box">
                    ${otp}
                </div>
                <p>এই OTP টি <strong>৫</strong> মিনিটের জন্য বৈধ। আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে এটি কারো সাথে শেয়ার করবেন না।</p>
                <p>আপনার সমর্থনের জন্য ধন্যবাদ। আপনার এক ফোঁটা রক্ত ​​অনেক জীবন বাঁচাতে পারে!</p>
                <p>শুভেচ্ছান্তে,<br>ইহসান আল-দিমা টিম</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} ইহসান আল-দিমা। সর্বস্বত্ব সংরক্ষিত।</p>
                <p><a href="[আপনার ওয়েবসাইটের লিঙ্ক]">আমাদের ওয়েবসাইট ভিজিট করুন</a></p>
            </div>
        </div>
    </body>
    </html>
  `;
};

export const sendAccActivationEmail = async (
  to: string,
  name: string,
  otp: number,
  subject: string = "আপনার ইহসান আল-দিমা অ্যাকাউন্ট যাচাই করতে OTP ব্যবহার করুন"
) => {
  const htmlContent = formateAccActivationEmail(name, otp);

  const info = await sendEmail(to, subject, htmlContent);

  return info;
};
