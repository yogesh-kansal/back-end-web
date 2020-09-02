const mongoose =require('mongoose');
const Schema =mongoose.Schema;

const dishSchima = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true

    }
},
    {
        timestamps: true    
});

var Dishes =mongoose.model('Dish', dishSchima);

module.exports=Dishes;