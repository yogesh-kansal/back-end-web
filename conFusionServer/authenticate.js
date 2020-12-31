var passport = require('passport');
var LocalStrategy =require('passport-local').Strategy;
var User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt= require('passport-jwt').ExtractJwt;
const jwt= require('jsonwebtoken');

const config =require('./config');
const { NotExtended } = require('http-errors');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken=function(user) {
    console.log(user);
    return jwt.sign(user,config.secretKey,
        {expiresIn:3600});
};

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
console.log("options are", opts);
opts.secretOrKey = config.secretKey;

console.log("options are", opts);


exports.jwtpassport=passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload",jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user)=> {
            if (err) {
                console.log("err is",err);
                return done(err, false);
            }
            else if (user) {
                console.log("user found")
                return done(null, user);
            } else {
                console.log("data is",err,user)
                return done(null, false);
                // or you could create a new account
            }
        });

    }));
exports.verifyUser = passport.authenticate('jwt',{session:false});

//verifyAdmin function updated

exports.verifyAdmin = (req,res,next) => {
    console.log(req.user);
    if(req.user.admin===true) {
        return next();
    }
    else {
        var err =new Error('you are not admin!!! so, not authorized for this operation');
        err.statusCode =403;
        return next(err);
    }

};
