const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//Models
const User = require ('../modelsDB/User.js');
const PastActivity = require ('../modelsDB/PastActivity.js');
const bcrypt = require('bcrypt');
const Logs = require('../modelsDB/logs.js');

router.post('/', function(req, res, next) {

    const {password , nickname} = req.body;      
        if(password){
            bcrypt.hash(password, 10). then((hash) =>{
                User.findById(mongoose.Types.ObjectId(req.decode.id)).then((user)=>{
                    user.password = hash;
                    const promise = user.save();
                    promise.then((data) =>
                    {
                         
                  }).catch((err)=>
                  { if(err.code == 11000){
                    res.status(400).json( { "msg":"Kullanıcı Zaten Kayıtlı",
                                          "detail" :err })
                  }
                    });
                }).catch((err)=>{
                    console.log(err);
                });
  
              });
        res.json({"msg" : "İşlem başarıyla gerçekleştirildi"});
 
        }
        var a = req.body;
        a["user"] = req.decode.id;
       const logs = new Logs({
        logs : a,
        types: 1
       });

       const promise = logs.save();
       promise.then((data)=>{
        console.log(data);
       }).catch((err)=>{
        console.log(err);
       });
});

router.post('/updateNickname', function(req,res,next){
   const {nickname} = req.body;
  if(nickname){
                
    User.findById(mongoose.Types.ObjectId(req.decode.id)).then((user)=>{
        user.nickname = nickname;
        const promise = user.save();
        promise.then((data) =>
        {
                res.json(data.nickname);
      }).catch((err)=>
      { if(err.code == 11000){
        res.status(400).json( { "msg":"Kullanıcı Zaten Kayıtlı",
                              "detail" :err,
                              "nickname": user.nickname});
      }
        });
    }).catch((err)=>{
        console.log(err);
    });



}
var a = req.body;
a["user"] = req.decode.id;
const logs = new Logs({
logs : a,
types: 2
});

const promise = logs.save();
promise.then((data)=>{
console.log(data);
}).catch((err)=>{
console.log(err);
});


});

router.get('/getProfile', function(req, res, next) {
  User.findById(mongoose.Types.ObjectId(req.decode.id)).then((user)=> {
    var a = user;
    res.json(user);
  }).catch((err)=> {
    res.json(err);
  })
  var a = req.body;
a["user"] = req.decode.id;
const logs = new Logs({
logs : a,
types: 3
});

const promise = logs.save();
promise.then((data)=>{
console.log(data);
}).catch((err)=>{
console.log(err);
});

});

router.get('/getUserStatistics',(req,res)=>{
  User.findById(mongoose.Types.ObjectId(req.decode.id)).then((user)=>{
  res.json(user.statistics); 
  });
  var a = req.body;
  a["user"] = req.decode.id;
  const logs = new Logs({
  logs : a,
  types: 3
  });
  
  const promise = logs.save();
  promise.then((data)=>{
  console.log(data);
  }).catch((err)=>{
  console.log(err);
  });
});


router.get('/pastUserActivity',(req,res)=>{
  PastActivity.findOne({id : mongoose.Types.ObjectId(req.decode.id)}).then((activity)=>{
  res.json(activity.activities); 
  });
  var a = req.body;
  a["user"] = req.decode.id;
  const logs = new Logs({
  logs : a,
  types: 3
  });
  
  const promise = logs.save();
  promise.then((data)=>{
  console.log(data);
  }).catch((err)=>{
  console.log(err);
  });
});

module.exports = router;

