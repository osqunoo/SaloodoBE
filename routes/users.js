var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({
  type: 'application/**json'
});
let config = require('../config');
var auth = require('../security/auth');

router.post('/signin',jsonParser,   (req, res, next) => {
  if(req.body.username){
  var username = req.body.username.toString().toLowerCase();
  if(config.Users.filter(obj => obj.username == username) != undefined && 
  config.Users.filter(obj => obj.username == username).length > 0){

    var userObj = config.Users.filter(obj => obj.username == username)[0];
    var userRole = userObj.role;

    if(userObj.password === req.body.password){
      const token = auth.generateJWT(req.body.username, Number(userRole));
      req.session.loggedIn = true;
      req.session.token = token;
      return res.json({
        data: 'Login Successed',
        role: userRole,
        token: token,
        userId: userObj.id,
        userName: userObj.username
      });
    }else{
      return res.json({
        data: 'Login Failed, Password Incorrect',
        role: '0',
        token: '' 
      });
    }
  }else{
    return res.json({
      data: 'Login Failed, Username Incorrect',
      role: '0',
      token: '' 
    });
  }
}else{
  return res.json({
    data: 'Login Failed, Username Incorrect',
    role: '0',
    token: '' 
  });
}
});











module.exports = router;