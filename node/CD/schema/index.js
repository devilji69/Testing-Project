var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

const user = require('./user');

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("CD");
    console.log("Database created!");
    dbo.createCollection("users", user);
  });