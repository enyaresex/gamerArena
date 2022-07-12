const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//Models
const User = require ('../modelsDB/User.js');
const PastActivity = require ('../modelsDB/PastActivity.js');
const bcrypt = require('bcrypt');


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



});

router.get('/getProfile', function(req, res, next) {
  User.findById(mongoose.Types.ObjectId(req.decode.id)).then((user)=> {
    var a = user;
    res.json(user);
  }).catch((err)=> {
    res.json(err);
  })
});

router.get('/getUserStatistics',(req,res)=>{
  User.findById(mongoose.Types.ObjectId(req.decode.id)).then((user)=>{
  res.json(user.statistics); 
  })
});


router.get('/pastUserActivity',(req,res)=>{
  PastActivity.findOne({id : mongoose.Types.ObjectId(req.decode.id)}).then((activity)=>{
  res.json(activity.activities); 
  })
});

module.exports = router;

