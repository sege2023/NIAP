// import { createHmac } from "crypto";
import { Router } from "express";
import express from "express";
import { paystackwebhook } from "../controllers/verifypayment.controller.mjs";
const webhookrouter = Router()
webhookrouter.post("/paystack", 
    express.raw({ type: "application/json" }),
    paystackwebhook);

export default webhookrouter