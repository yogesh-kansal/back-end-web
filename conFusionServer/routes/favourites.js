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
    .populate('favs')
    .then((resp) => {
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Fav.find({user: req.user._id})
    .then((dish) => {
        if(dish.length==0){
            
            var arr=[];
            req.body.forEach(function(entry, index) {
                    arr.push(entry.feild);
                });
        
            Fav.create({user: req.user._id,favs:arr})
            .then((ans)=>{
                console.log(ans);
                res.statusCode=200;
                res.setHeader('Content-type','application/json');
                res.json(ans);
            })
            .catch(err=>next(err));
        }
        else{
            req.body.forEach(function(entry, index) {
                if(dish[0].favs.indexOf(String(entry.feild))==-1) {
                    dish[0].favs.push(entry.feild);
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
        }      
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
            var arr=[];
            arr.push(req.params.favId);
            Fav.create({user: req.user._id,favs:arr})
            .then(ans => {
                res.statusCode=200;
                res.setHeader('Content-type','application/json');
                res.json(ans);
            })
            .catch(err=>next(err));
        }  
        else{
            if(resp[0].favs.indexOf(String(req.params.favId))==-1) {   
                resp[0].favs.push(req.params.favId);                  
                resp[0].save()
                .then((dish)=>{
                    res.statusCode=200;
                    res.setHeader('Content-type','application/json');
                    res.json(dish);
                })
                .catch(err=>next(err));
            }
            else {
                err=new Error('dish already exists');
                err.statusCode=200;
                return next(err);
            }
        }      
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
            var err =new Error('you have no items to delete');
            err.statusCode=403;
            return next(err);
        }  
        else {
            var index=dish[0].favs.indexOf(req.params.favId);
            if(index!=-1){
                console.log(dish[0].favs[index]);
            dish[0].favs.splice(index,1);
            dish[0].save()
            .then((Resp) => {
                res.statusCode=200;
                res.setHeader('Content-type','application/json');
                res.json(Resp);        
            })
            .catch((err) => next(err));
            }
            else {
                var err =new Error('you have no items for given data to delete');
                err.statusCode=403;
                return next(err);
            }
        }  
    })
    .catch((err)=>next(err));
});


module.exports =favRouter;
