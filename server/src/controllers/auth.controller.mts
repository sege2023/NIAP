import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { createUserId, generateCode, sendVerificationEmail , generateToken} from "../utils/authutils.mjs";
import { storeTempcode, verfiyTempCode } from "../services/auth.service.mjs";

export const validateUser = async (req:Request, res:Response) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
      
        if (!token) {
           res.status(401).json({ message: 'Unauthorized' });
           return;
        }
      
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!);
          console.log('user is authenticated');
          res.status(200).json({ok:true, message: 'Token is valid' });
        //   (req as any).user = decoded;
        } catch (err) {
          res.status(401).json({ message: 'Invalid token' });
          console.log("error verifying token", err);
          console.error('Unable to authenticate:', err);
        }
}
export const requestVerificationCode = async (req:Request, res:Response) => {
    const {email} = req.body
    try {
        if (!email) {
            res.status(400).json({
                error: 'email required'
            })
            return;
        }
        // console.log("generating code")
        const code = generateCode()
        // console.log("storing code")
        const[store,send] = await Promise.all([
            storeTempcode(email, code),
            sendVerificationEmail(email, code)
        ])
        // await storeTempcode(email,code)
        console.log("sending email ..")
        // await sendVerificationEmail(email, code);
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
    const user = await verfiyTempCode(email, code);
    if (!user) {
        res.status(400).json({ message: "Invalid or expired code" });
        return;
    }
    console.log('code matches with db tempcode');

    const token = generateToken(user);
    console.log("token generated")
    res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in prod, false in dev
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" in prod, "lax" in dev
    maxAge: 14 * 24 * 60 * 60 * 1000,

    // res.cookie("token", token, {
    // httpOnly: true,
    // secure: true, // because NODE_ENV === "production"
    // sameSite: "none", // because NODE_ENV === "production"
    // maxAge: 14 * 24 * 60 * 60 * 1000,

});
    res.status(200).json({ success: true, message: "Code verified successfully" });

    return;
}