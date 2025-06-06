import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import { Decimal } from "@prisma/client/runtime/library";
// import { User } from "@prisma/client";
// import JwtPayloadUser from "./types/user.mts";
// import JwtPayloadUser from "../../../types/user.mjs";
dotenv.config()
export type JwtPayloadUser = {
  userId: bigint;
  email: string;
  walletBalance: Decimal;
};
export const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};
  
export const sendVerificationEmail = async (email: string, verificationCode: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.EMAIL_PASSWORD, 
    },
  });
  
  await transporter.sendMail({
    from: '"NIAP" <timishittu67@gmail.com>',
    to: email,
    subject: "Verification Code",
    text: `Your verification code is: ${verificationCode}`,
  });
};
 
export const createUserId = (): bigint =>{
  return BigInt(Math.floor(1e10 + Math.random() * 9e10));
}
export const generateToken = (user:JwtPayloadUser) =>{
  return jwt.sign(
    {
      userId: user.userId.toString(),
      email: user.email,
      balance: user.walletBalance 
    },
    process.env.JWT_SECRET!,
    { expiresIn: '14d' }
  );
}