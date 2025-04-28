import { prisma } from "../prisma/prisma.mjs"
export const findUserbyId = async (userId:bigint) => {
    const user = await prisma.user.findUnique({
        where: { userId },
        select: {
            email: true,
            userId: true,
            walletBalance: true
        }
    });
    return user;
}