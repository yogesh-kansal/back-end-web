const http=require('http');
const fs=require('fs');
const path=require('path');

const hostname='localhost';
const port=3000;

const server=http.createServer((req,res) => {
    console.log("request for "+req.url+' by method '+req.method);

    if(req.method=='GET') {
        var fileUrl;
        if(req.url=='/') fileUrl='/index.html';
        else fileUrl=req.url;

        var filePath=path.resolve('./public'+fileUrl);
        const fileExt=path.extname(filePath);
        if(fileExt=='.html') {
            console.log(req.headers);
            fs.exists(filePath,(exists) => {
                console.log(req.headers);
                if(!exists) {
                    res.statusCode=404;
                    res.setHeader('Content-type','text/html');
                    res.end('<html><body><h1>Errror 404: '+fileUrl+' not found</h1></body></html>');
                
                return;
                }
                console.log(req.headers);
                res.statusCode=200;
                res.setHeader('Content-type','text/html');
                fs.createReadStream(filePath).pipe(res);
                //console.log(res);
            })

        }
        else {
            res.statusCode=404;
            res.setHeader('Content-type','text/html');
            res.end('<html><body><h1>Errror 404: '+fileUrl+' not an html file </h1></body></html>');
        
        return;

        }
    }
    else {
        res.statusCode=404;
        res.setHeader('Content-type','text/html');
        res.end('<html><body><h1>Errror 404: '+req.method+' not supported</h1></body></html>');
    
    return;
    }
  
    

})


server.listen(port,hostname,() => {
    console.log(`The server running at http://${hostname}:${port} `);


});