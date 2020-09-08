const express=require('express');
const bodyParser=require('body-parser');

const Promos = require('../models/promos');

const promoRouter=express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req,res,next) =>{
    Promos.find({})
    .then((promos) => {
        res.sendStatus=200;
        res.setHeader('Content-Type','application/json');
        res.json(promos);
    })
    .catch((err) => next(err));
})
.post((req,res,next) =>{
    Promos.create(req.body)
    .then((promo_dish) =>{
        console.log('new dish created: ',promo_dish);
        res.sendStatus=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo_dish);
    })
    .catch((err) => next(err));
})
.put((req,res,next) =>{
    res.statusCode=403;
    res.end('PUT operation is not supported on /promotions' );
})
.delete((req,res,next) =>{
    Promos.remove({})
    .then((resp) => {
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(resp);        
    })
    .catch((err) => next(err));
    
});



promoRouter.route('/:promoId')
.get((req,res,next) => {
    Promos.findById(req.params.promoId)
    .then((promo_dish) => {
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(promo_dish);

    })
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put((req, res, next) => {
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
.delete((req, res, next) => {
    Promos.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(resp);        
    })
    .catch((err) => next(err));
});


module.exports=promoRouter;