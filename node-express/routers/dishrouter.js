const express=require('express');
const bodyParser=require('body-parser');

const dishRouter=express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req,res,next) => {
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('will send all dishes to you');
})
.post((req,res,next) =>{
    res.end('will add dish: '+req.body.name+' with details: '+req.body.discription);
})
.put((req,res,next) =>{
    res.statusCode=403;
    res.end('PUT operation is not supported on /dishes' );
})
.delete((req,res,next) =>{
    res.end('deleting all dishes!');
});


module.exports=dishRouter;