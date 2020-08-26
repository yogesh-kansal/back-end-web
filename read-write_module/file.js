var fs=require('fs');
/*
var readme=fs.readFileSync('readme.txt');
fs.writeFileSync('write.txt',readme);

*/

fs.readFile('./readme.txt','utf8',(err,data)=>{
    fs.writeFile('./write.txt',data);
});

