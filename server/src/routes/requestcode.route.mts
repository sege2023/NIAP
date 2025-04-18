import { requestVerificationCode } from "../controllers/auth.controller.mjs";
import { Router } from "express";
const requestCodeRouter = Router()
requestCodeRouter.post("/", requestVerificationCode)
export default requestCodeRouter