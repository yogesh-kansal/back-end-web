var passprt = require('passport');
var LocalStrategy =require('passport-local').Strategy;
var User = require('./models/user');
const passport = require('passport');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

