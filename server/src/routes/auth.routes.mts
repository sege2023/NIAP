// import express from "express";
import { Router } from "express";
import { requestVerificationCode , verifyCode} from "../controllers/auth.controller.mjs";

const router = Router();

router.post("/request-code", requestVerificationCode); // Step 1
router.post("/verify-code", verifyCode);               // Step 2

export default router;

