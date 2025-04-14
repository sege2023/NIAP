import { create } from "domain"
import { prisma } from "../prisma/prisma.mjs"

export const storeTempcode = async (email: string, code:string) => {
    await prisma.verficationCode.create({
        data:{
            email,
            code,
            expiresAt: new Date(Date.now() + 15*60*1000),
        }
    })
}

export const verfiyTempCode = async (email:string, code: string) => {
    const record = await prisma.verficationCode.findFirst({
        where: {email,code}, 
        orderby: {createdAt: "desc"},

    
    })
    if (!record || new Date() > record.expiresAt) return false;
  return true;
};
