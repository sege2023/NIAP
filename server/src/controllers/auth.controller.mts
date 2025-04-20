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
            return;
        }
        console.log("generating code")
        const code = generateCode()
        console.log("storing code")
        await storeTempcode(email,code)
        console.log("sending email ..")
        await sendVerificationEmail(email, code);
        res.status(200).json({ message: "Verification code sent!" });
    } catch (error) {
        console.error('registration error',error)
        res.status(500).json({error:'internal server error'})
        return;
    }

}

export const verifyCode = async (req:Request, res:Response) => {
    const { email, code } = req.body;
    console.log("checking code with db for verification")
    const isValid = await verfiyTempCode(email, code);
    console.log('code matches with db tempcode')
    res.status(200).json({ success: true, message: "Code verified successfully" });
  
    if (!isValid) {
        res.status(400).json({ message: "Invalid or expired code" });
        return;
    }
    return;
}