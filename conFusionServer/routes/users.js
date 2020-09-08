var express = require('express');
const bodyParser = require('body-parser');
var User=require('../models/user');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',(req,res,next) => {
  User.findOne({username:req.body.username})
  .then((user) => {
    if(user!=null) {
      var err =new Error('User '+req.body.username+"already exists!");
      err.status =403;
      next(err);
    }
    else {
      return User.create( {
        username:req.body.username,
        password:req.body.password
      })
    }

  })
  .then((user) => {
    res.statusCode=200;
    res.setHeader('Content-type','application/json');
    res.json({status:'resistration successfull !',user: user});
  })
  .catch((err) => next(err));
});

router.post('/login',(req,res,next) => {
  if(!req.session.user) {
  
    var authHeader = req.headers.authorization;
  
    if(!authHeader) {
      var err =new Error('Yu are not autherized');
  
      res.setHeader('WWW-Authenticate','Basic');
      err.status=401;
      return next(err);
    }
  
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  
    var username = auth[0];
    var password = auth[1];

    User.findOne({ username:username})
    .then((user) => {
      if(user==null) {
        var err =new Error('user '+username+'doesn\'t exists');
        err.status=403;
        return next(err);
      }
      else if(user.password != password) {
        var err =new Error('Incorrect password');
        err.status=403;
        return next(err);
    
      }
        
    else if(user.username=== username && user.password=== password) {
      req.session.user='authenticated';
      res.statusCode=200;
      res.setHeader('Content-Type','application/json');
      res.end('You are authnticated');
      next();
    }

    })
    .catch((err) => next(err));
    
  }
  else {
    res.statusCode=200;
    res.setHeader("Content-Type",'text/plain');
    res.end('you are already authenticated');
  }

});

router.get('/logout', (req,res,next) => {
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

module.exports = router;
