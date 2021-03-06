const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
//Models
const User = require ('../modelsDB/User.js');
const jwt = require('jsonwebtoken');

/* Register */
router.post('/register', function(req, res, next) {
  const {nickname, nameSurname, email, password, birthdate, country} = req.body;
 
 
bcrypt.hash(password, 10). then((hash) =>{
  const user = new User({
    nickname,
    nameSurname,
    email,
    password : hash,
    birthdate,
    country
   });
 
  const promise = user.save();
  promise.then((data) =>
  {
      // var response = data.Object();
      // delete response.password;
      var obj = data.toObject();
    
      delete obj.password;
      delete obj.statistics;
      console.log(obj);
      res.json(obj);
}).catch((err)=>
{ if(err.code == 11000){
  res.status(400).json( { "msg":"Kullanıcı Zaten Kayıtlı",
                        "detail" :err })
}
  });
});
  
});

router.post('/login', function(req, res, next) {
  const {nickname, password} = req.body;
  let userAvatar = "";
 User.findOne({
  nickname
 }, (err,user)=>{
    if(err)
      throw err;
      if(!user){
        res.status(400).json({"msg" : "Kullanıcı adı veya şifre yanlış",
                              "detail": ""});
      }else{
        bcrypt.compare(password, user.password).then((result)=>{
          if(!result){
          res.status(400).json({"msg" : "Kullanıcı adı veya şifre yanlış",
          "detail": ""});
        }else{
          const payload = {
            nickname,
            id : user._id
          };
          const token = jwt.sign(payload, req.app.get('api_secret_key'),{expiresIn : 72000});
          if(user.avatar){
            userAvatar = user.avatar;
          }
          userAvatar
          res.json({
            token,
            "coin" : 589,
            "wallet" : 4785,
            "nickname" : user.nickname,
            "avatar" : userAvatar
          })
            }
        });

      }

 });

  
});



module.exports = router;
