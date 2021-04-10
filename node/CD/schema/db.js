// const MongoClient = require('mongodb').MongoClient
// const connectionString = "mongodb://localhost/CD"
const user = require('./user');

//   MongoClient.connect(connectionString, {
//     useUnifiedTopology: true
//   }, (err, client) => {
//     if (err) return console.error(err)
   
//     const db = client.db('CD')
//     console.log('Connected to Database')
//     db.createCollection("users", user);
//   })
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/my_database';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));