const express=require('express');
const bodyParser=require('body-parser');
const cors =require('./cors');
const Leaders = require('../models/leaders')
const authenticate=require('../authenticate');
const leaderRouter=express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser,(req,res,next) =>{
    Leaders.find({})
    .then((leaders) => {
        res.sendStatus=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    })
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    Leaders.create(req.body)
    .then((leader_dish) =>{
        console.log('new dish created: ',leader_dish);
        res.sendStatus=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader_dish);
    })
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    res.statusCode=403;
    res.end('PUT operation is not supported on /leaders' );
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    Leaders.remove({})
    .then((resp) => {
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(resp);        
    })
    .catch((err) => next(err));
    
});


leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.get(cors.cors, (req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader_dish) => {
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(leader_dish);

    })
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotions/'+ req.params.leaderId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set :req.body
    },
    {
        new:true
    })
    .then((leader_dish) => {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader_dish);
    })
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(resp);        
    })
    .catch((err) => next(err));
});



module.exports=leaderRouter;