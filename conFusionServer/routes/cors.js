const experess =require('express');
const cors =require('cors');
const app =experess();

const whitelist =['http://localhost:3001','https://localhost:3444'];
var corsOptionsdelegates = (req,callback) => {
    var corsOptions;

    if(whitelist.indexOf(req.header('Origin'))!= -1) {
        corsOptions={origin:true};
    }
    else {
        corsOptions= {origin:false};
    }
    callback(null,corsOptions);

};

exports.cors = cors();
exports.corsWithOptions =cors(corsOptionsdelegates);



