import { createHmac } from "crypto";
import { Request,Response } from "express";
import { updateWalletBalance } from "../services/verifypayment.service.mjs";
// import { Request, Response } from "express";
export const paystackwebhook = async (req:Request, res:Response) => {
    const secret = process.env.PAYSTACK_SECRET_KEY as string;
    const hash = createHmac("sha512", secret).update(JSON.stringify(req.body)).digest("hex");
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
        const event = req.body;
        console.log('Webhook event data:', JSON.stringify(event, null, 2))
        if (event.event === "charge.success" && event.data.status === "success") {
           const { amount, reference, customer } = event.data;
            const email  = customer.email;
            console.log(`Charge success for email: ${email}, amount: ${amount}, reference: ${reference}`);
           await updateWalletBalance(email, amount, reference);
           console.log("Wallet updated successfully!")
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