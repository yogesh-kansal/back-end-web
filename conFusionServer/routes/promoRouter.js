const express=require('express');
const bodyParser=require('body-parser');
const cors =require('./cors');
const Promos = require('../models/promos');
const authenticate =require('../authenticate');
const promoRouter=express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req,res,next) =>{
    Promos.find({})
    .then((promos) => {
        res.sendStatus=200;
        res.setHeader('Content-Type','application/json');
        res.json(promos);
    })
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    Promos.create(req.body)
    .then((promo_dish) =>{
        console.log('new dish created: ',promo_dish);
        res.sendStatus=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo_dish);
    })
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    res.statusCode=403;
    res.end('PUT operation is not supported on /promotions' );
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    Promos.remove({})
    .then((resp) => {
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(resp);        
    })
    .catch((err) => next(err));
    
});



promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Promos.findById(req.params.promoId)
    .then((promo_dish) => {
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(promo_dish);

    })
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promos.findByIdAndUpdate(req.params.promoId,{
        $set :req.body
    },
    {
        new:true
    })
    .then((promo_dish) => {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo_dish);
    })
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promos.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(resp);        
    })
    .catch((err) => next(err));
});


module.exports=promoRouter;