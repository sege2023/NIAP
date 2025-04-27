import { Request, Response } from "express";
import { paystackResponse } from "../services/paystack.service.mjs";
export const topUp = async (req:Request, res:Response) => {
    const {email,amount} = req.body;
    try {
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