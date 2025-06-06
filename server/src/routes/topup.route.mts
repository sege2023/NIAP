import { Router } from "express";

const topupRouter = Router();
import { topUp } from "../controllers/topup.controller.mjs";
// import { authenticateTopup } from "../middleware/topup.mjs";
import { isAuthenticated } from "../middleware/home-auth.mjs";
topupRouter.post("/",isAuthenticated, topUp);
export default topupRouter;