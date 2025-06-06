import { Request } from "express";
import { JwtPayloadUser } from "./utils/authutils.mts";
declare global{
    namespace Express{
        interface Request{
            user?: JwtPayloadUser
        }
    }
}