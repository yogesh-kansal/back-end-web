var express = require('express');
const bodyParser = require('body-parser');
var User=require('../models/user');
var passport = require('passport');
var cors =require('./cors');
var authenticate = require('../authenticate');
const e = require('express');


var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.options('*',cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
router.get('/',cors.corsWithOptions,  authenticate.verifyUser,authenticate.verifyAdmin, function(req, res, next) {
  User.find({})
  .then((users) => {
    res.statusCode=200;
    res.setHeader('Cotetnt-Type','application/json');
    res.json(users);
  })
  .catch((err) => next(err));

  //res.send('respond with a resource');
});

router.post('/signup',cors.corsWithOptions, (req,res,next) => {
  User.register(new User({username:req.body.username}),req.body.password,
  (err,user) => {
    if(err) {
      res.statusCode=500;
      res.setHeader ('Content-type','application/json');
      res.json({err: err});

    }
    else {
      console.log("req is",req);
      
      if(req.body.firstname)
        user.firstname=req.body.firstname;
      if(req.body.lastname)
        user.lastname=req.body.lastname;
      user.save((err, user) => {
        console.log("user is",user);
        if(err) {
          res.statusCode=500;
          res.setHeader ('Content-type','application/json');
          res.json({err: err});
          console.log("res is",res)
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode=200;
          res.setHeader('Content-type','application/json');
          res.json({success: true,status:'resistration successfull !'});
      });
     });
    } 
  });
});

router.post('/login', cors.corsWithOptions, (req,res,next) => {

  //doing autherization here to get more informations instead of only"unautherized"
  passport.authenticate('local',(err, user, info)=> {
    if(err)
      return next(err);
    
    if(!user) {
        res.statusCode=401;
        res.setHeader('Content-Type','application/json');
        res.json({success: false, status:'login unsuccessfull!', err: info});
        return;
    }

    req.logIn(user, (err)=>{
      if(err) {
        res.statusCode=401;
        res.setHeader('Content-Type','application/json');
        res.json({success: false, status:'login unsuccessfull!', err: 'Could not login user'});
        return;
      }

      var token=authenticate.getToken({_id:req.user._id});
      res.statusCode=200;
      res.setHeader('Content-Type','application/json');
      res.json({success: true,token:token,status:'login successfull!'});
      return;
    })
  }) (req, res, next);

});


router.get('/checkJWTToken', cors.corsWithOptions, (req,res, next)=>{
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if(err)
      return next(err);
    if(!user) {
      res.statusCode=401;
      res.setHeader('Cntent-Type','application/json');
      res.json({status: 'JWT inValid!', success: false, err: info});
      return;
    }
    else {
      res.statusCode=200;
      res.setHeader('Cntent-Type','application/json');
      res.json({status: 'JWT Valid!', success: true, user: user});
      return;
    }
  }) (req, res, next);

});


/*jwt token does not supported logout of sesion because it has no feild to destroy token
router.get('/logout', cors.corsWithOptions,  (req,res,next) => {
  console.log(req.session);
  if(req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err= new Error("you are not logged in");
    err.status=403;
    next(err);
  }
});
*/
module.exports = router;
