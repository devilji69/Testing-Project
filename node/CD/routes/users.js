var express = require('express');
var router = express.Router();
var User = require('../schema/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



//login
router.post('/login', function(req, res, next) {
  res.header('Content-Type', 'application/json');
  const email_id = req.body.email_id;
  const password = req.body.password;
  const username = req.body.username;
  console.log(email_id)
  console.log(password)
  
  var user = new User({
    "email_id": email_id,
    "password": password,
    "username": username
  });

  user.save()
   .then(doc => {
     console.log(doc)
   })
   .catch(err => {
     console.error(err)
   })


  return res.send({ success: true });
});


module.exports = router;
