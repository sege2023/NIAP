// // import { verifyToken } from '../utils/authUtils.mjs';
import jwt from 'jsonwebtoken';
import { Request,Response, NextFunction, RequestHandler} from "express";

// export const protect = async (req:Request, res:Response, next: NextFunction) => {
//   try {
//     // 1. Get token from cookies or Authorization header
//     const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
//     if (!token) {
//       return res.status(401).json({ 
//         message: "Not authorized - no token provided" 
//       });
//     }

//     // 2. Verify token
//     const decoded = verifyToken(token);
    
//     // 3. Attach user to request
//     req.user = {
//       userId: decoded.userId,
//       email: decoded.email,
//       walletBalance: decoded.walletBalance,
//       role: decoded.role
//     };

//     next();
//   } catch (err) {
//     console.error('Auth error:', err.message);
//     return res.status(401).json({ 
//       message: "Not authorized - invalid token" 
//     });
//   }
// };

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  
    if (!token) {
       res.status(401).json({ message: 'Unauthorized' });
       return;
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      (req as any).user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };