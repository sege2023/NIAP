import { createHmac } from "crypto";
import { Request,Response } from "express";
import { createTransactionRecord, updateWalletBalance } from "../services/verifypayment.service.mjs";
import { prisma } from "../prisma/prisma.mjs";
export const paystackwebhook = async (req:Request, res:Response) => {
    const secret = process.env.PAYSTACK_SECRET_KEY as string;
    console.log('Type of req.body:', typeof req.body);
    console.log('Is req.body a Buffer?', Buffer.isBuffer(req.body)); 
    const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : JSON.stringify(req.body);
    const hash = createHmac("sha512", secret).update(rawBody).digest("hex");
    const signature = req.headers["x-paystack-signature"] as string;
    console.log('Webhook received! Checking signature...'); 
    console.log('Paystack Signature:', signature); 
    console.log('Calculated Hash:', hash); 

    if (hash !== signature) {
        res.status(401).send('Unauthorized');
        console.error('Webhook signature mismatch! Unauthorized access attempt.'); 
        return;
    }
    try {
        const event = JSON.parse(rawBody);
        console.log('Webhook event data:', JSON.stringify(event, null, 2))
        if (event.event === "charge.success" && event.data.status === "success") {
        //    const { amount, reference, customer } = event.data;
            const { amount, reference, customer, currency, transaction_date, gateway_response, channel, fees , ip_address} = event.data;
            const {customer_code, first_name, last_name} = customer;
            const email  = customer.email;
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                console.error(`User with email ${email} not found for transaction reference ${reference}`);
                res.status(404).send("User not found for transaction processing");
                return;
            }

            console.log(`Charge success for email: ${email}, amount: ${amount}, reference: ${reference}`);
           await updateWalletBalance(email, amount, reference);
           await createTransactionRecord(user.userId, {
                userId: user.userId,
                reference,
                amount: amount / 100, // Convert from kobo to actual amount
                status: 'success', // Or directly event.data.status if saving all statuses
                currency,
                transactionDate: new Date(transaction_date), 
                gatewayResponse: gateway_response,
                channel,
                fees: fees ? fees / 100 : null,
                customerCode:customer_code,
                ipAddress: ip_address,
                firstName: first_name,
                lastName: last_name,
                type: 'deposit' 
           })
           console.log("Wallet updated successfully! and transaction recorded.");
            res.status(200).send("Payment verified and wallet updated successfully");
        }else {
           console.log(`Webhook event type: ${event.event}, status: ${event.data.status}. Not a successful charge.`); 
           res.status(200).send("Event received, but not a successful charge for wallet update.");
        }
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).send("Internal Server Error");
    }
}