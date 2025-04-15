import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config()
export const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  };
  
  export const sendVerificationEmail = async (email: string, verificationCode: string) => {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD, 
      },
    });
  
    await transporter.sendMail({
      from: "NIAP <no-reply@Campusride.com>",
      to: email,
      subject: "Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    });
  };
  