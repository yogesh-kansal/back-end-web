var passprt = require('passport');
var LocalStrategy =require('passport-local').Strategy;
var User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt= require('passport-jwt').ExtractJwt;
const jwt= require('jsonwebtoken');

const config =require('./config');
const passport = require('passport');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken=function(user) {
    return jwt.sign(user,config.secretKey,
        {expiresIn:3600});
};

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtpassport=passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload",jwt_payload);
        User.findOne({id: jwt_payload.sub}, (err, user)=> {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });

    }));

exports.verifyUser = passport.authenticate('jwt',{session:false});