const mongoose =require('mongoose');
const Schema =mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const currency = mongoose.Types.Currency;
 
const leader_schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true

    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    featured: {        
        type: Boolean,
        default: false
    }
});


var Leaders =mongoose.model('Leader', leader_schema);

module.exports=Leaders;