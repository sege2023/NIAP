import { createHmac } from "crypto";
import { Request,Response } from "express";
import { updateWalletBalance } from "../services/verifypayment.service.mjs";
// import { Request, Response } from "express";
export const paystackwebhook = async (req:Request, res:Response) => {
    const secret = process.env.PAYSTACK_SECRET_KEY as string;
    const hash = createHmac("sha512", secret).update(JSON.stringify(req.body)).digest("hex");
    const signature = req.headers["x-paystack-signature"] as string;
    if (hash !== signature) {
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        const event = req.body;
        if (event.event === "charge.success" && event.data.status === "success") {
           const { amount, reference, customer } = event.data;
            const { email } = customer.email;

           await updateWalletBalance(email, amount, reference);
           console
            res.status(200).send("Payment verified and wallet updated successfully");
        }
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).send("Internal Server Error");
    }
}