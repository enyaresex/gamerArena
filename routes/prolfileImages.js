const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const User = require ('../modelsDB/User');
const mongoose = require('mongoose');
const fs = require('fs');
let userGuid;

let oldImage;
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images/')
  },
  filename: function (req, file, cb) {
    console.log(file);
    userGuid = uuid.v1()+file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    cb(null, userGuid);
    console.log(file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length));
  }
});
const upload = multer({storage: storage})
router.post('/', upload.array('profile'), (req, res, next) => {
    //console.log(req.decode.id)
    User.findById(mongoose.Types.ObjectId(req.decode.id)).then((user)=>{
      oldImage = user.avatar;
      user.avatar = userGuid;
      const promise = user.save();
      promise.then((data)=> {
        //console.log(data);
        if(data.avatar){
          
          
          fs.unlink("./images/"+oldImage, (err) => {
            if (err) {
                console.log("failed to delete local image:"+err);
            } else {
                console.log('successfully deleted local image');                                
            }
    });
          // Assuming that 'path/file.txt' is a regular file.

        }
      }).catch((err)=>{
        req.json(err);
      })
    }).catch((err)=>{
      req.json(err);
    });


    console.log(userGuid);
   
    res.json(userGuid);
});

module.exports = router;
