import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../prisma/prisma.mjs";
export const performTransfer = async (senderId: bigint, amount:Decimal, receiverId: bigint) => {
    if (amount.lte(new Decimal(0))) {
        throw new Error("Amount must be greater than zero");
    }
    await prisma.$transaction(async (tx) => {
        const sender = await tx.user.findUnique({
            where: { userId: senderId },
            select: { userId: true, email: true, walletBalance: true }
        });
        if (!sender) {
            throw new Error("Sender not found.");
        }
        if (sender.walletBalance < amount) {
            throw new Error("Insufficient wallet balance.");
        }
         const receiver = await tx.user.findUnique({
            where: { userId: receiverId },
            select: { userId: true, email: true }
        });

        if (!receiver) {
            throw new Error("Receiver not found.");
        }
        if (sender.userId === receiver.userId) {
            throw new Error("Cannot transfer to self.");
        }

        await tx.user.update({
            where: {userId: senderId},
            data: {walletBalance: {decrement: amount}}
        })

        await tx.user.update({
            where:{userId: receiverId},
            data:{walletBalance:{increment:amount}}
        })

        const senderTx = await tx.transaction.create({
            data:{
                userId: sender.userId,
                reference: `TRF_OUT_${Date.now()}_${sender.userId}`, // Generate unique reference
                amount: amount,
                status: 'success',
                currency: 'NGN', // Or dynamic
                transactionDate: new Date(),
                type: 'transfer_out',
                gatewayResponse: `Transferred to ${receiver.email}`,
            }
        })

        const receiverTx = await tx.transaction.create({
            data: {
                userId: receiver.userId,
                reference: `TRF_IN_${Date.now()}_${receiver.userId}`, // Generate unique reference
                amount: amount,
                status: 'success',
                currency: 'NGN', // Or dynamic
                transactionDate: new Date(),
                type: 'transfer_in',
                gatewayResponse: `Received from ${sender.email}`,
                // relatedTransactionId will be set after sender's tx is created
            }
        });
        await tx.transaction.update({
            where: { id: senderTx.id },
            data: { relatedTransactionId: receiverTx.id }
        });

         await tx.transaction.update({
            where: { id: receiverTx.id },
            data: { relatedTransactionId: senderTx.id }
        });


        return { success: true, message: "Transfer successful" };
    })

    
}