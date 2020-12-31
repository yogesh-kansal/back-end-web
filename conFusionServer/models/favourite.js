const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    feild: {
        type: Schema.Types.ObjectId,
        ref: 'Dish',
        required: true 
    }
})

const fav_schema = new Schema({
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    favs: [{
        type:Schema.Types.ObjectId,
        ref: 'Dish',
        required: true
    }]
    //can directly put inside but i creted new schema seperatly for simplicity
},
{
    timestamps:true

});

const Favs =mongoose.model('Fav',fav_schema);
module.exports=Favs;