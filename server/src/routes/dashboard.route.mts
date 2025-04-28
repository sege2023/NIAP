import { sendUserData } from "../controllers/dashboard.controller.mjs";
import { Router } from "express";
const dashboardRouter = Router()
dashboardRouter.get("/", sendUserData)
export default dashboardRouter