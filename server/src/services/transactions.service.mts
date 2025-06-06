import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../prisma/prisma.mjs";
// import { Decimal } from "@prisma/client";

interface TransactionSelect {
    amount: Decimal;
    status: string;
    transactionDate: Date;
    type: string | null;
}
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
    } )
    return transactions.map((t: TransactionSelect)=>({
        ...t,
        transactionDate: t.transactionDate.toISOString()
    }))
}