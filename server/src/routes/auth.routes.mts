// import express from "express";
import { Router } from "express";
import { requestVerificationCode , verifyCode} from "../controllers/auth.controller.mjs";
import { protect } from "../middleware/home-auth.mjs";

const homerouter = Router();

homerouter.get('/home', protect, (req, res) => {
    res.json({ 
    //   user: req.user,
      content: "Secret data" 
    });
  });

export default homerouter;


