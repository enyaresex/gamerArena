const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//Models
const User = require ('../modelsDB/User.js');
const bcrypt = require('bcrypt');

/* Bir oyun ayarı kaydetme */
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
    if(nickname){
                
                    User.findById(mongoose.Types.ObjectId(req.decode.id)).then((user)=>{
                        user.nickname = nickname;
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
      
      
        
                }


                res.json({"msg" : "İşlem başarıyla gerçekleştirildi"});
 
        }
   




   

});

module.exports = router;
