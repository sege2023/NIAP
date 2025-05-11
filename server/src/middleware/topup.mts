import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: { email: string };
}

export const authenticateTopup = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    req.user = { email: decoded.email };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
