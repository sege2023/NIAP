// import { User } from "@prisma/client"
import { prisma } from "../prisma/prisma.mjs"
export const updateWalletBalance = async (email: string, amount: number, reference: string) => { 
    await prisma.user.update({
        where: { email },
        data: { walletBalance: { increment: amount/100 } }
    })
}

interface TransactionData {
    userId: bigint;
    reference: string;
    amount: number;
    status: string;
    currency: string;
    transactionDate: Date;
    gatewayResponse?: string;
    channel?: string;
    fees?: number | null;
    customerCode?: string;
    ipAddress?: string;
    firstName?: string;
    lastName?: string;
    type: string; 
}

export const createTransactionRecord = async (userId: bigint, data: TransactionData) => {
    await prisma.transaction.create({
        data: {
            userId,
            reference: data.reference,
            amount: data.amount,
            status: data.status,
            currency: data.currency,
            transactionDate: data.transactionDate,
            gatewayResponse: data.gatewayResponse,
            channel: data.channel,
            fees: data.fees,
            customerCode: data.customerCode,
            ipAddress: data.ipAddress,
            firstName: data.firstName,
            lastName: data.lastName,
            type: data.type
        }
    });
}