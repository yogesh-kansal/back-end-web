const mongoose=require('mongoose');
const passport = require('passport');
const Schema=mongoose.Schema;
const passportLocalMongoose =require('passport-local-mongoose');

var  User = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        
        type: String,
        default: ''

    },    
    admin: {
        type:Boolean,
        default:false
    }
});

User.plugin(passportLocalMongoose);
//plugin adds username and hashed password fields(hash,salt) in User modal



module.exports = mongoose.model('user',User);

