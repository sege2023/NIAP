import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { createUserId, generateCode, sendVerificationEmail } from "../utils/authutils.mjs";
import { storeTempcode, verfiyTempCode } from "../services/auth.service.mjs";
// interface requestbody{
//     email:string
// }
export const requestVerificationCode = async (req:Request, res:Response) => {
    const {email} = req.body
    try {
        if (!email) {
            res.status(400).json({
                error: 'email required'
            })
        }
        const code = generateCode()
        await storeTempcode(email,code)
        await sendVerificationEmail(email, code);
        res.status(200).json({ message: "Verification code sent!" });
    } catch (error) {
        console.error('registration error',error)
    }

}

export const verifyCode = async (req:Request, res:Response) => {
    const { email, code } = req.body;
    const isValid = await verfiyTempCode(email, code);
  
    if (!isValid) {
        res.status(400).json({ message: "Invalid or expired code" });
    }
    return;
}