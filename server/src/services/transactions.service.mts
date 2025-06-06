import { prisma } from "../prisma/prisma.mjs";
export const findUserTransactions = async (userId: bigint, skip: number, take:number) => {
    const transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { transactionDate: 'desc' },
        skip,
        take, // Default limit for main page
        select:{
            amount: true,
            status: true,
            transactionDate: true,
            type: true
        }
    })
    return transactions.map(t=>({
        ...t,
        transactionDate: t.transactionDate.toISOString()
    }))
}