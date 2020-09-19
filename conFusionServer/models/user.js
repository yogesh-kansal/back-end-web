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


module.exports = mongoose.model('user',User);

