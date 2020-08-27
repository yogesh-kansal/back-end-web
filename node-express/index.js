const express =require('express');
const http=require('http');
const morgan=require('morgan');
const bodyParser=require('body-parser');


const hostname='localhost';
const port=3001;

const app=express();
app.use(morgan('dev'));
app.use(bodyParser.json());


app.all('/dishes',(req,res,next) => {
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    next();
});

app.get('/dishes',(req,res,next) =>{
    res.end('will send all dishes to you');
});

app.post('/dishes',(req,res,next) =>{
    res.end('will add dish: '+req.body.name+' with details: '+req.body.discription);
});

app.put('/dishes',(req,res,next) =>{
    res.statusCode=403;
    res.end('PUT operation is not supported on /dishes' );
});

app.delete('/dishes',(req,res,next) =>{
    res.end('deleting all dishes!');
});


app.get('/dishes/:dishId',(req,res,next) =>{
    res.end('will send details of dish: '+req.params.dishId+' to you!');
});

app.post('/dishes/:dishId',(req,res,next) =>{
    res.end('POST operation is not supported on /dishes/'+req.parms.dishId);
});

app.put('/dishes/:dishId',(req,res,next) =>{
    res.write('Updating the dish: '+req.params.dishId+'\n');
    res.end('Will update the dish:'+req.body.name+'with details: '+req.body.discription);
});

app.delete('/dishes/:dishId',(req,res,next) =>{
    res.end('deleting dish: '+req.params.dishId);
});

app.use(express.static(__dirname+'/public'));

app.use((req, res, next) => {
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    res.end('<html><body><h1>This is an express server</h1></body></html>');
    
});


const server=http.createServer(app);

server.listen(port,hostname,() => {
    console.log(`Server is running at http://${hostname}:${port}`);

})