// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
// import { JwtPayloadUser } from "../utils/authutils.mjs";

// export const authenticateTopup = (req: Request, res: Response, next: NextFunction) => {
//   // const token = req.headers.authorization?.split(" ")[1];
//   // const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
//   // if (!token) {
//   //   console.log("No token provided");
//   //   res.status(401).json({ message: "Unauthorized" });
//   //   return;
//   // }
//   const userEmail = req.user?.email
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
//     req.user = { email: decoded.email };
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//     return;
//   }
// };
