import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { generateCode } from "../utils/authutils.mjs";
interface requestbody{
}
export const requestVerificationCode = async (req:Request, res:Response) => {
    const code = generateCode()

}