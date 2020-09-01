const MongoClient = require('mongodb').MongoClient;
const assert=require('assert');
const dboper = require('./operations');

const url= 'mongodb://localhost:27017/';
const dbname='conFusion';


MongoClient.connect(url,(err,client) =>{

    assert.equal(err,null);

    console.log('Connected correctly to server');

    const db=client.db(dbname);

    dboper.insertDocument(db, {name:"Akash" ,class:"gen"}, 'dishes',(result) => {

        console.log('InsertDocument:\n',result.ops);

        dboper.findDocument(db, 'dishes', (docs) => {
            console.log('Found Document:\n',docs);

            dboper.updateDocument(db,{name:"Akash"},{class:"updated"},'dishes',(result) => {
                console.log('Updated documnet:\n',result.result);

                dboper.findDocument(db, 'dishes', (docs) => {
                    console.log('Found Document:\n',docs);
                    db.dropCollection('dishes', (result) =>{
                        console.log('Dropped Collection: ',docs);

                    });

                });

            });
        });
    });
});
