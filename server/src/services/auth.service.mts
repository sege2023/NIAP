import { prisma } from "../prisma/prisma.mjs"
import { createUserId } from "../utils/authutils.mjs";


export const storeTempcode = async (email: string, code:string) => {
    await prisma.tempUser.create({
        data:{
            email,
            code,
            expiresAt: new Date(Date.now() + 15*60*1000),
            createdAt: new Date(Date.now()),
            lastSentAt: new Date
        }
    })
}

export const verfiyTempCode = async (email:string, code: string) => {
    const userId = createUserId()
    const record = await prisma.tempUser.findFirst({
        where: {email,code}, 
        orderBy: {createdAt: "desc"},
    })
    if (!record || new Date() > record.expiresAt) return false
    
    if (record && new Date() < record.expiresAt) {
        await prisma.user.create({
          data: {
            email,
            userId,
            createdAt: new Date(),
            lastLogin: new Date(),  
            walletBalance: 0,
            role: "customer",
            verified: true
          }
        });
        return true;
      }
  return true;
};
