import { Router } from "express";

const topupRouter = Router();
import { topUp } from "../controllers/topup.controller.mjs";
import { authenticateTopup } from "../middleware/topup.mjs";
topupRouter.post("/",authenticateTopup, topUp);
export default topupRouter;