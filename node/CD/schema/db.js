


var mongoose = require('mongoose');
var mongoDB = process.env.MONGO_URL;


const conn = mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true,useCreateIndex: true}).
  catch(error => console.log(error));
  mongoose.set('useFindAndModify', false);  
module.exports = conn;
