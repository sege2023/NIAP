// import { User } from "@prisma/client"
import { prisma } from "../prisma/prisma.mjs"
export const updateWalletBalance = async (email: string, amount: number, reference: string) => { 
    await prisma.user.update({
        where: { email },
        data: { walletBalance: { increment: amount/100 } }
    })
}