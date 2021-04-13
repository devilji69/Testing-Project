
var mongoose = require('mongoose');
var Schema = mongoose.Schema;  
  
var UserSchema = new Schema({   
    email_id: {type: String, required:true, unique:true},
    password : {type: String, unique: true, required:true},
    username : {type: String},
    mobile_token : {type: String},
    first_name : {type: String},
    last_name : {type: String},
    country_code : {type: Number},
    mobile_no : {type: Number},
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date
    }
});
  
 
  const users = mongoose.model("User", UserSchema);
  module.exports = users;
 