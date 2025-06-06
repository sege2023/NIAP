import { Router } from "express";
import { getTransactions } from "../controllers/transactions.controller.mjs";
import { isAuthenticated } from "../middleware/home-auth.mjs"; // Your authentication middleware

const transactionRouter = Router();

transactionRouter.get("/", isAuthenticated, getTransactions); // Protect this route

export default transactionRouter;