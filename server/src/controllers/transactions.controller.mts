import { Request , Response} from "express"
import { findUserTransactions } from "../services/transactions.service.mjs";
import { JwtPayloadUser } from "../utils/authutils.mjs"
import { prisma } from "../prisma/prisma.mjs";
export const getTransactions = async (req: Request, res:Response) => {
//     const token = req.cookies.token;
//     if (!token) {
//         res.status(401).json({ message: "Unauthorized" });
//         return
        
//     }
    const user = req.user as JwtPayloadUser
    const userId = BigInt(user.userId)
    const page = parseInt(req.query.page as string)
    const limit = parseInt(req.query.limit as string) || 8; // Default limit for main page
    const skip = (page - 1) * limit;
    try {
        const transactions = await findUserTransactions(userId, skip, limit);
        const totalTransactions = await prisma.transaction.count({ where: { userId } }); // Get total count for pagination info

        res.status(200).json({
            transactions,
            totalTransactions,
            currentPage: page,
            totalPages: Math.ceil(totalTransactions / limit),
            hasMore: (page * limit) < totalTransactions
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Failed to fetch transactions" });
    }
}