const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Fav = require('../models/favourite');

const favRouter = express.Router();
favRouter.use(bodyParser.json());
favRouter.use(bodyParser.urlencoded({
    extended: true
}));

favRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Fav.find({user:req.user._id})
    .populate('user')
    .populate('favs.feild')
    .then((resp) => {
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Fav.find({user: req.user._id})
    .then((resp) => {
        if(resp.length==0){
            console.log(resp.length);
            Fav.create({user: req.user._id})
            .then((ans)=>{
                console.log(ans);
            })
            
        }
        Fav.find({user: req.user._id})
        .then((dish) => {
            arr=[];
            for(var i=0;i<dish[0].favs.length;i++) {
                arr.push(String(dish[0].favs[i].feild._id));
            }
            req.body.forEach(function(entry, index) {
                if(arr.indexOf(String(entry.feild))==-1) {
                    dish[0].favs.push(entry);
                }
                                                
            });        
            dish[0].save()  
            .then((dish)=>{
                console.log( dish);
                res.statusCode=200;
                res.setHeader('Content-type','application/json');
                res.json(dish);
            })
            .catch((err)=>next(err));
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) =>{
    res.statusCode=403;
    res.end('PUT operation is not supported on /favourites' );
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Fav.find({user: req.user._id})
    .then((resp) => {
        if(resp.length) {
        Fav.remove({user: req.user._id})
        .then((Resp) => {
            res.statusCode=200;
            res.setHeader('Content-type','application/json');
            res.json(Resp);        
            })
            .catch((err) => next(err));
        
        }
        else {
            err =new Error('not exists');
            err.statusCode=200;
            return next(err);
        }
    })
    .catch((err) => next(err));  
});



favRouter.route('/:favId')
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) =>{
    res.statusCode=403;
    res.end('GET operation is not supported on /favourites/'+req.params.favId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Fav.find({user: req.user._id})
    .then((resp) => {

        if(resp.length==0) {
            Fav.create({user: req.user._id});
        }  
        Fav.find({user: req.user._id})
        .then((dish)=>{
            arr=[];
            for(var i=0;i<dish[0].favs.length;i++) {
                arr.push(String(dish[0].favs[i].feild._id));
            }
            if(arr.indexOf(String(req.params.favId))==-1) {   
                dish[0].favs.push({feild:req.params.favId});                  
                dish[0].save()
                .then((dish)=>{
                    console.log('Dish created', dish);
                    res.statusCode=200;
                    res.setHeader('Content-type','application/json');
                    res.json(dish);

                })
            }
            else {
                err=new Error('dish already exists');
                err.statusCode=200;
                return next(err);
            }
            })
            .catch((err) =>next(err));         
    })

    .catch((err) => next(err));

})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) =>{
    res.statusCode=403;
    res.end('PUT operation is not supported on /fourites'+req.params.favId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) =>{
    Fav.find({user: req.user._id})
    .then((dish) => {

        if(dish.length==0) {
            var err =new Error('you are no items to delete');
            err.statusCode=403;
            return next(err);
        }  
        else {
            for(var i=0;i<dish[0].favs.length;i++) {
                if((dish[0].favs[i].feild._id).equals(req.params.favId)){
                    break;
                }
            }
            dish[0].favs[i].remove();
            dish[0].save()
            .then((Resp) => {
                res.statusCode=200;
                res.setHeader('Content-type','application/json');
                res.json(Resp);        
            })
            .catch((err) => next(err));
        }  
    })

    
});


module.exports =favRouter;
