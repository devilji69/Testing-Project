var jwt = require('jsonwebtoken');
var UserModel = require('../schema/user');



const auth = async(req,res,next)=>{
    var token = req.headers['x-access-token'];
    if (!token){
        return res.send({ status: false, message: 'Please provide token.' });
    }
    
    try {
          jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
            if (err) {
              return res.send({ status: false, message: 'Failed to authenticate token.' });
            }
            req.user_id = user.id;
            next()
         })
    } catch (error) {
        console.log("auth error",error);
        res.send({status:false,message:"Something wrong try later."})
    }
}
module.exports=auth;