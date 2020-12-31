const experess =require('express');
const cors =require('cors');
const app =experess();
// :3001 for rest API server at http
// :3444 for rest API server at https
// :3000 for REACT client 
const whitelist =['http://localhost:3001','https://localhost:3444','http://localhost:3000'];
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



