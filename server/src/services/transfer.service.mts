import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../prisma/prisma.mjs"; // Adjust path as needed
import { v4 as uuidv4 } from 'uuid';

export const performTransfer = async (senderId: bigint, amount: Decimal, receiverId: bigint) => {
    // 1. Basic Validation
    if (amount.lte(new Decimal(0))) {
        throw new Error("Amount must be greater than zero");
    }
    if (senderId === receiverId) {
        throw new Error("Cannot transfer to self.");
    }

    // 2. The ACID Transaction
    return await prisma.$transaction(async (tx) => {
        // --- STEP A: ATOMIC DECREMENT (The Security Fix) ---
        // We attempt to update ONLY IF the user has enough balance.
        // This prevents race conditions without needing to "read" the balance first.
        const senderUpdate = await tx.user.updateMany({
            where: {
                userId: senderId,
                walletBalance: {
                    gte: amount // "Where balance >= amount"
                }
            },
            data: {
                walletBalance: { decrement: amount }
            }
        });

        // If count is 0, it means the 'where' clause failed (insufficient funds)
        if (senderUpdate.count === 0) {
            throw new Error("Insufficient wallet balance or invalid user.");
        }

        // --- STEP B: INCREMENT RECEIVER ---
        // We use 'update' here because we want to throw an error if receiver doesn't exist
        const receiver = await tx.user.update({
            where: { userId: receiverId },
            data: { walletBalance: { increment: amount } },
            select: { email: true, userId: true } // Only select what we need
        }).catch(() => {
            // If this fails, the transaction rolls back, and sender gets their money back automatically
            throw new Error("Receiver not found.");
        });

        // --- STEP C: CREATE TRANSACTION RECORDS ---
        const reference = uuidv4(); // Shared unique ID if you wanted a group ID, or generate unique ones

        // 1. Create Sender's Record
        const senderTx = await tx.transaction.create({
            data: {
                userId: senderId,
                reference: `TRF_OUT_${reference}`, 
                amount: amount,
                status: 'success',
                currency: 'NGN',
                type: 'transfer_out',
                gatewayResponse: `Transferred to ${receiver.email}`,
            }
        });

        // 2. Create Receiver's Record (Link to SenderTx immediately)
        const receiverTx = await tx.transaction.create({
            data: {
                userId: receiverId,
                reference: `TRF_IN_${uuidv4()}`,
                amount: amount,
                status: 'success',
                currency: 'NGN',
                type: 'transfer_in',
                gatewayResponse: `Received transfer`,
                relatedTransactionId: senderTx.id // Link backwards immediately
            }
        });

        // 3. Link Sender to Receiver (The only update needed)
        await tx.transaction.update({
            where: { id: senderTx.id },
            data: { relatedTransactionId: receiverTx.id }
        });

        return { 
            success: true, 
            message: "Transfer successful", 
            transactionId: senderTx.id,
            balance: (await tx.user.findUnique({where: {userId: senderId}}))?.walletBalance 
        };
    });
}