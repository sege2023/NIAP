import { prisma } from "../prisma/prisma.mjs"
import { createUserId } from "../utils/authutils.mjs";


export const storeTempcode = async (email: string, code:string) => {
  await prisma.tempUser.upsert({
    where: { email },
    update: { 
      code,
      expiresAt: new Date(Date.now() + 15*60*1000),
      lastSentAt: new Date()
    },
    create: {
      email,
      code,
      expiresAt: new Date(Date.now() + 15*60*1000),
      createdAt: new Date(),
      lastSentAt: new Date()
    }
  });
}

export const verfiyTempCode = async (email:string, code: string) => {
    const userId = createUserId()
    const record = await prisma.tempUser.findFirst({
        where: {email,code}, 
        orderBy: {createdAt: "desc"},
    })
    if (!record || new Date() > record.expiresAt) return null
    const existingUser = await prisma.user.findUnique({
        where: {email},
        select: {userId: true,
          walletBalance: true
        }
    })
    
    if (existingUser) {
      await prisma.user.update({
        where: { email },
        data: { lastLogin: new Date() }
      });
      return existingUser;
    }
    
    const newUser = await prisma.user.create({
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
    return newUser;
};
