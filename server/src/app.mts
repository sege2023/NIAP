import express from 'express';
const PORT = 9000
const app = express();
app.use(express.json())
app.use('/api/v1', )
app.get('/', (req,res) =>{
    res.status(200).send('hello, world!');
});
app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`)
})