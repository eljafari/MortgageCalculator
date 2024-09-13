const express = require('express');
const cors = require('cors');
const post_calculateMortgage = require('./controler/mortgageController')

const app = express();
app.use(cors());
const port = 3000;


app.use(express.json());

app.get('/', (req,res)=>{
    res.send('Hello');
});

app.post('/api/mortgage/calculate', (req, res) => {
    post_calculateMortgage(req,res);
})

app.listen(port, ()=> console.log(`Server is running on http://localhost:${port}`));