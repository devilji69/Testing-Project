// import cryptoRandomString from 'crypto-random-string';
var express = require('express');
// const { catch } = require('../schema/db');
var router = express.Router();
var jwt = require('jsonwebtoken');
var UserModel = require('../schema/user');
var auth = require('../middleware/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



//login
router.post('/login', async function(req, res, next) {
  // res.header('Content-Type', 'application/json');
  
  const Bcrypt = require("bcryptjs");
  const email_id = req.body.email_id;
  const password = req.body.password
  const username = req.body.username;
 
    try{
      var user = await UserModel.findOne({ username:username,email_id:email_id }).exec();
      if(!user) {
          return res.status(200).send({ message: "This user does not exist.Please check login" });
      }
      if(!Bcrypt.compareSync(password, user.password)) {
          return res.status(200).send({ message: "Password is invalid" ,status:false});
      }
      var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_SECRET_TOKEN_TIMELIMIT // expires in 24 hours
      });
      // console.log("token=======",token)
          return res.send({ status:true,message: "Login sucessfully.",token:token,user_data:user});

    }catch(error){
          return res.status(200).send({message: "Something wrong,try later.",status:false});
    }

});


router.post('/register',async function(req, res, next) {
  res.header('Content-Type', 'application/json');
  
  const Bcrypt = require("bcryptjs");
  const email_id = req.body.email_id;
  const password = Bcrypt.hashSync(req.body.password, 10);
  const username = req.body.username;
  const mobile_no = req.body.mobile_no;
  const country_code = req.body.country_code;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  
  var user = new UserModel({
    "email_id": email_id,
    "password": password,
    "username": username,
    "mobile_no":mobile_no,
    "country_code":country_code,
    "first_name":first_name,
    "last_name":last_name
  });

  user.save().then(data => {
        return res.send({ message: "Sucessfully register user.",status:true });
  }).catch(error => {
      // console.log("error=",error)
      if (error.name === 'MongoError' && error.code === 11000) {
          return res.send({ message: "User is already register.",status:false });
      } else {
          return res.send({ message: "Something wrong try again register user.",status:false });
    }
  })

});

//update user data
router.post("/update",auth, async (request, response) => {
  try {
    const user_id = request.user_id;
    // console.log(user_id);
    const condition = { _id: user_id };
    const update = {
      first_name: request.body.first_name,
      last_name: request.body.last_name,
      username: request.body.username,
      mobile_no: request.body.mobile_no,
      country_code: request.body.country_code,
      email_id: request.body.email_id
     };

      await UserModel.findOneAndUpdate(condition,update, {new: true},function(error, user_data) {
       if(error){
        return response.send({ message: "Something wrong try again update user.",status:false });
       }
       return response.send({ message: "Sucessfully update data.",status:true,user_data:user_data });
      });
   
  } catch (error) {
      return response.send({ message: "Something wrong try later.",status:false });
  }
});

// get user profile data
router.post("/getdata",auth, async (request, response) => {
  const user_id = request.user_id;
    UserModel.findById(user_id, function (err, userdata) {
         if(err){
          return response.status(200).send({message: "Something wrong,try later.",status:false});
         }
          if(!userdata){
            return response.send({message: "User not found.",status:false});
          }else{
            return response.send({message: "User found.",status:true,"user_data":userdata});
          }
      });
});


//change user password
router.post("/reset-password",auth, async (request, response) => {
  try {
    const Bcrypt = require("bcryptjs");
    const condition = { _id: request.user_id };
    const new_password = request.body.new_password;
    const recheck_password = request.body.recheck_password;

    if(new_password == recheck_password){

      const update = {
        password: Bcrypt.hashSync(request.body.new_password, 10)
      };
      await UserModel.findOneAndUpdate(condition,update, {new: true},function(error, user_data) {
        if(error){
         return response.send({ message: "Something wrong try later.",status:false });
        }
        return response.send({ message: "Sucessfully password  changed.",status:true,user_data:user_data });
      });
    }else{
      return response.send({ message: "New password not match,Please check.",status:false });
    }
    
    
   
  } catch (error) {
      return response.send({ message: "Something wrong try later.",status:false });
  }
});

//forgot password
router.post("/forgot-password", async (req, res) => {
  try {
    
    const email_id = req.body.email_id;
   

    UserModel.find({email_id:email_id}, function (err, userdata) {
      if(err){
      return res.status(200).send({message: "Something wrong,try later.",status:false});
      }
      const userId = userdata[0]?._id;
      if(userId == undefined){
        return res.send({message: "User not found.",status:false});
      }else{
         const Bcrypt = require("bcryptjs");
        // const jade = require('jade');
        const hbs = require('handlebars');
        const fs = require('fs');
        var randomstring = require("randomstring");
        //set randome password

        var password = randomstring.generate(8);
        const condition = { _id: userId };
        const update = {
          password: Bcrypt.hashSync(password, 10)
        };

         UserModel.findOneAndUpdate(condition,update, {new: true},function(err,userdata) {
          if(err){
           return response.send({ message: "Something wrong try later.",status:false });
          }
         });

        //end
        // var templateUrl = process.cwd() + '/views/forgot-password.jade';
        // temp = jade.compile(fs.readFileSync(templateUrl, 'utf8'))
        temp = hbs.compile(fs.readFileSync('views/forgot-password.hbs', 'utf8'))
        // var htmlFile = temp({ userAlertData: data,userName:userName})
       
        var context = {new_password: password,emailId:email_id};
        // console.log("context",context)
        var htmlFile = temp(context);
        
        var nodemailer = require('nodemailer');
        
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: process.env.GMAIL_ID,
              pass: process.env.GMAIL_PASSWORD,
          }
        });
        
        var mailOptions = {
          from: process.env.GMAIL_ID,
          to: email_id,
          subject: 'Forgot Password.',
          html : htmlFile
        };
        
         transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    // console.log(error);
                    return res.send({message: "Something is wrong,please try later.",status:false});
                } else {
                    // console.log('Email sent: ' + info.response);
                    return res.send({message: "Sucessfully sent email.",status:true});
                }
         });
      }
    });
    
   
  } catch (error) {
      return res.send({ message: "Something wrong try later.",status:false });
  }
});

module.exports = router;
