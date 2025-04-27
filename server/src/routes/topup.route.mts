import { Router } from "express";

const topupRouter = Router();
import { topUp } from "../controllers/topup.controller.mjs";
topupRouter.post("/", topUp);
export default topupRouter;