const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const User = require ('../modelsDB/User');
const mongoose = require('mongoose');
let userGuid;
let oldImage;
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images/')
  },
  filename: function (req, file, cb) {
    userGuid = uuid.v1();
    cb(null, userGuid+file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length));
   // console.log(file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length));
  }
});
const upload = multer({storage: storage})
router.post('/', upload.single('profile'), (req, res, next) => {
    //console.log(req.decode.id)
    User.findById(mongoose.Types.ObjectId(req.decode.id)).then((user)=>{
      
      user.avatar = userGuid;
      const promise = user.save();
      promise.then((data)=> {
        console.log(data);
        if(data.avatar){
          oldImage = data.avatar;
          var fs = require('fs');
          fs.unlink("./images/"+oldImage, callbackFunction);
        }
      }).catch((err)=>{
        console.log(err);
      })
    }).catch((err)=>{
      console.log(err);
    });


    console.log(userGuid);
    console.log(req.decode.id);
    res.json("zeyneo");
});

module.exports = router;
