import express from 'express';

import post_calculateMortgage from './controler/mortgageController.js';


const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req,res)=>{
    res.send('Hello');
});

app.post('/api/mortgage/calculate', (req, res) => {
    post_calculateMortgage(req,res);
})

app.listen(port, ()=> console.log(`Server is running on http://localhost:${port}`));