
// importing modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var passportLocalMongoose = require('passport-local-mongoose');
  
  
var UserSchema = new Schema({   
    email_id: {type: String, required:true, unique:true},
    username : {type: String},
    password : {type: String, unique: true, required:true},
});
  
// plugin for passport-local-mongoose
// UserSchema.plugin(passportLocalMongoose);
  console.log("------------");
  console.log("------------");
  console.log("------------");
// export userschema
 module.exports = mongoose.model("User", UserSchema);