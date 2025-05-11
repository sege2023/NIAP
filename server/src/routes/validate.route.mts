import { Router } from "express";
import { validateUser } from "../controllers/auth.controller.mjs";
// import { authenticateUser } from "../controllers/auth.controller.mjs";
const validateRouter = Router()
validateRouter.get("/", validateUser)  
export default validateRouter