import express from 'express';
import requestCodeRouter from './routes/requestcode.route.mjs';
import verifyCodeRouter from './routes/verifycode.route.mjs';
const PORT = 9000
const app = express();
app.use(express.json())
app.use('/api/v1/requestcode', requestCodeRouter)
app.use('/api/v1/verifycode', verifyCodeRouter)
app.get('/', (req,res) =>{
    res.status(200).send('hello, world!');
    console.log(`${req.method} ${req.path}`);
});
app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`)
})