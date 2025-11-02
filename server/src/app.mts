import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import requestCodeRouter from './routes/requestcode.route.mjs';
import verifyCodeRouter from './routes/verifycode.route.mjs';
import dashboardRouter from './routes/dashboard.route.mjs';
// import { protect } from './middleware/home-auth.mjs';
// import homerouter from './routes/auth.routes.mjs';
import topupRouter from './routes/topup.route.mjs';
import webhookrouter from './routes/verifypayment.route.mjs';
import validateRouter from './routes/validate.route.mjs';
import transactionRouter from './routes/transactions.route.mjs'; 
import pingrouter from './routes/ping.route.mjs';
const PORT = process.env.PORT || 9000
const app = express();
app.use('/api/v1/webhook', webhookrouter)
const corsOptions = {
    origin: ['https://niap.pages.dev', 'http://localhost:5173'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
};

app.use(express.json())
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/api/v1/validate',validateRouter)
app.use('/api/v1/requestcode', requestCodeRouter)
app.use('/api/v1/verifycode', verifyCodeRouter)
app.use('/api/v1/dashboard', dashboardRouter)
app.use('/api/v1/topup', topupRouter)
app.use('/api/v1/transactions', transactionRouter)
app.use('/api/v1', pingrouter);

app.get('/', (req,res) =>{
    res.status(200).send('hello, world!');
    console.log(`${req.method} ${req.path}`);
});


app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`)
})