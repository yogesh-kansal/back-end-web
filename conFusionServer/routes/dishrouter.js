const express=require('express');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const cors =require('./cors');
const Dishes = require('../models/dishes');
const authenticate= require('../authenticate');
const dishRouter=express.Router();
dishRouter.use(bodyParser.json());


//here .options() is used for: client first sends .options method to verify weather the actual request is safe to send
//cors.cors gives permission for any type of origin
// cors.corsWithOptions gives permission to specified origins 

dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.get(cors.cors, (req,res,next) =>{
    Dishes.find(req.query)  //for query paramet  
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(dishes);
    })
    .catch((err) => next(err));

})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,  (req,res,next) =>{
  Dishes.create(req.body)
  .then((dish) => {
      console.log('Dish created', dish);
      res.statusCode=200;
      res.setHeader('Content-type','application/json');
      res.json(dish);
  })
  .catch((err) => next(err));
    
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,  (req,res,next) =>{
    res.statusCode=403;
    res.end('PUT operation is not supported on /dishes' );
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,  (req,res,next) =>{
    Dishes.remove({})
    .then((resp) => {
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(resp);        
    })
    .catch((err) => next(err));
});



dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.get(cors.cors, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(dish);
    })
    .catch((err) => next(err));
    
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    },
    {new: true})
    .then((dish) => {
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(dish);
    })
    .catch((err) => next(err));


})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(resp);        
    })
    .catch((err) => next(err));
});

module.exports=dishRouter;










/*
dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser,(req,res,next) =>{
    //console.log(req.user);
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if(dish != null) {            
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(dish.comments);
        }
        else {
            err = new Error('Dish '+req.params.dishId+ ' not found');
            err.statusCode = 404;
            return next(err);
        }
    })
    .catch((err) => next(err));

})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) =>{
  Dishes.findById(req.params.dishId)
  .then((dish) => {
    if(dish != null) {    
        req.body.author = req.user._id;        
        dish.comments.push(req.body);
        dish.save()
        .then((dish) => { 
            console.log("dish is",dish);
            Dishes.findById(dish._id)
            .populate('comments.author')
            .then((dish) => {
                res.statusCode=200;
                res.setHeader('Content-type','application/json');
                res.json(dish);
            })          
        })  
        }
        else {
            err = new Error('Dish '+req.params.dishId+ ' not found');
            err.statusCode = 404;
            return next(err);
        }        
  })
  .catch((err) => next(err));
    
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) =>{
    res.statusCode=403;
    res.end('PUT operation is not supported on /dishes/'+req.params.dishId +' /comments');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null) {    
            for( var i=dish.comments.length-1;i>=0;i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            
            dish.save()
             .then((dish) => {            
                res.statusCode=200;
                res.setHeader('Content-type','application/json');
                res.json(dish.comments);
        })
        
            }
            else {
                err = new Error('Dish '+req.params.dishId+ ' not found');
                err.statusCode = 404;
                return next(err);
            }       
    })
    .catch((err) => next(err));
});



dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.get(cors.cors, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId)!=null) {            
            res.statusCode=200;
            res.setHeader('Content-type','application/json');
            res.json(dish.comments.id(req.params.commentId));
            }
            else if(dish ==null) {
                err = new Error('Dish '+req.params.dishId+ ' not found');
                err.statusCode = 404;
                return next(err);
            }
            else{
                err = new Error('comment '+req.params.commentId+ ' not found');
                err.statusCode = 404;
                return next(err);
            }
     })
    .catch((err) => next(err));
    
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId+' /comments/'
  +req.params.commentId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId)!=null) {  
            if(!((req.user._id).equals(dish.comments.id(req.params.commentId).author._id))) {
                var err =new Error('you are not allowded to update this comment because it is not yours');
                err.statusCode=403;
                return next(err);
            }
            
            if(req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;               
            }
            if(req.body.comment) {
                dish.comments.id(req.params.commentId).comment =req.body.comment;
            }
            dish.save()
            .then((dish) => { 
            Dishes.findById(dish._id)
            .populate('comments-author');           
             res.statusCode=200;
             res.setHeader('Content-type','application/json');
             res.json(dish);
        })
      
            
            }
            else if(dish ==null) {
                err = new Error('Dish '+req.params.dishId+ ' not found');
                err.statusCode = 404;
                return next(err);
            }
            else{
                err = new Error('comment '+req.params.commentId+ ' not found');
                err.statusCode = 404;
                return next(err);
            }
    })
    .catch((err) => next(err));


})
.delete(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId)!=null) { 
            if(!((req.user._id).equals(dish.comments.id(req.params.commentId).author._id))) {
                var err =new Error('you are not allowded to delete this comment because it is not yours');
                err.statusCode=403;
                return next(err);
            }   
            dish.comments.id(req.params.commentId).remove();
            
            dish.save()
             .then((dish) => {            
                Dishes.findById(dish._id)
                .populate('comments.author');           
                 res.statusCode=200;
                 res.setHeader('Content-type','application/json');
                 res.json(dish);
        })
        
            }
            else if(dish ==null) {
                err = new Error('Dish '+req.params.dishId+ ' not found');
                err.statusCode = 404;
                return next(err);
            }
            else{
                err = new Error('comment '+req.params.commentId+ ' not found');
                err.statusCode = 404;
                return next(err);
            }     
    })
    .catch((err) => next(err));

});
*/
