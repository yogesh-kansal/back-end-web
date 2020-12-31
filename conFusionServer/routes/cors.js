const experess =require('express');
const cors =require('cors');
const app =experess();

const whitelist =['http://localhost:3001','https://localhost:3444'];
var corsOptionsdelegates = (req,callback) => {
    var corsOptions;

    if(whitelist.indexOf(req.header('Origin'))!= -1) {
        corsOptions={origin:true};
        callback(null,corsOptions);
    }
    else {
        corsOptions= {origin:false};
        var error = new Error("Provided origin is not secured for communication!!!");
        error.status=403;
        callback(error,corsOptions);
        //return next(error);
    }


};

exports.cors = cors();
exports.corsWithOptions =cors(corsOptionsdelegates);



