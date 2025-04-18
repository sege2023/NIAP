import { Router } from "express";
import { verifyCode } from "../controllers/auth.controller.mjs";

const verifyCodeRouter = Router()
verifyCodeRouter.post('/', verifyCode)
export default verifyCodeRouter