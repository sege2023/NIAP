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
        select: {
          email: true,
          userId: true,
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

// On protected routes:
// const verifyToken = async(req: Request, res: Response, next: NextFunction) => {
//   const token = req.cookies.token;
//   const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  
//   const user = await prisma.user.findUnique({
//     where: { userId: decoded.userId },
//     select: { walletBalance: true }
//   });

//   if (user.walletBalance !== decoded.balance) {
//     return res.status(403).json({ message: "Balance mismatch - reauthentication required" });
//   }
  
//   next();
// };
