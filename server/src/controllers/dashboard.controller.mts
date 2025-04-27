import { Request,Response } from "express"
import jwt from "jsonwebtoken"
import { JwtPayloadUser } from "../utils/authutils.mjs"
export const sendUserData = async (req: Request, res: Response) => {
    // const user = req.user as JwtPayloadUser;
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return
        
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadUser;
        res.status(200).json({
            userId: decoded.userId,
            email: decoded.email,
            balance: decoded.walletBalance
          });
    } catch (error) {
        console.error('JWT verification failed:', error);
         res.status(401).json({ message: 'Invalid token' });
         return
    }
}