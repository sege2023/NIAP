import { Request,Response } from "express"
import jwt from "jsonwebtoken"
import { findUserbyId } from "../services/dashboard.service.mjs"
import { JwtPayloadUser } from "../utils/authutils.mjs"
export const sendUserData = async (req: Request, res: Response) => {
    // const user = req.user as JwtPayloadUser;
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return
        
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as  Pick<JwtPayloadUser, 'userId' >;
        
        const userId = BigInt(decoded.userId)
        const user = await findUserbyId(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return
        }
        console.log('sending user data', user)
        res.status(200).json({
            userId: user.userId.toString(), // Convert BigInt to string for JSON serialization
            email: user.email,
            balance: user.walletBalance
        });
        console.log('User data sent successfully:');
        return

    } catch (error) {
        console.error('JWT verification failed:', error);
         res.status(401).json({ message: 'Invalid token' });
         return
    }
}