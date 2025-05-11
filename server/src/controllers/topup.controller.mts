import { Request, Response } from "express";

// Extend the Request interface to include the 'user' property
declare global {
    namespace Express {
        interface Request {
            user?: { email: string };
        }
    }
}
import { paystackResponse } from "../services/paystack.service.mjs";
export const topUp = async (req:Request, res:Response) => {
    const email = req.user?.email
    const {amount} = req.body;
    try {
        if (!email) {
            res.status(400).json({ message: "Email is required" });
            return
        }
        const response = await paystackResponse(email, amount);
        const { authorization_url, access_code, reference } = response.data;

        // Optionally save access_code and reference for later verification
        res.json({ authorization_url, access_code, reference });
        return;
    } catch (error) {
        console.error("Paystack error:", error);
    res.status(500).json({ message: "Failed to initialize payment" });
    }
}