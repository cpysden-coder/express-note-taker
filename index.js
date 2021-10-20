const express = require('express');
const app = express();

const PORT = 3000;

app.get("/", (req,res)=>{
    res.send("eventually this will be the home page")
});

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`)
});