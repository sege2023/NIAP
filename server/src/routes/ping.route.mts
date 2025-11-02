// keepAliveRoutes.js - Using Prisma (no Supabase client needed!)
import { Router } from "express";
const pingrouter = Router()
import { prisma } from "../prisma/prisma.mjs";

// Simple ping endpoint - just keeps Render awake
pingrouter.get('/ping', (req, res) => {
  res.status(200).json({ 
    status: 'alive', 
    timestamp: new Date().toISOString() 
  });
});

pingrouter.get('/health', async (req, res) => {
  try {
    
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({ 
      status: 'alive', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check error:', error);
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ 
      status: 'error', 
      message
    });
  }
});

// module.exports = pingrouter;
export default pingrouter;

// In your app.js or index.js:
// const keepAliveRoutes = require('./routes/keepAliveRoutes');
// app.use('/', keepAliveRoutes);