const express =require('express');
const http=require('http');
const morgan=require('morgan');
const bodyParser=require('body-parser');




const hostname='localhost';
const port=3000;

const app=express();
app.use(morgan('dev'));
app.use(bodyParser.json());


app.use('/dishes',require('./routers/dishrouter'));
app.use('/promotions', require('./routers/promoRouter'));
app.use('/leaders', require('./routers/leaderRouter'));


app.use(express.static(__dirname+'/public'));

app.use((req, res, next) => {
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    res.end('<html><body><h1>This is an express server</h1></body></html>');
    
});
