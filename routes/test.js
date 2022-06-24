const express = require('express');
const  router = express.Router();
const User = require ('../modelsDB/User.js');
const mongoose = require ('mongoose');
/* GET home page. */
router.post('/', function(req, res, next) {
    //userStatistics ekleme
    const {statistics} = req.body;
    User.findById(mongoose.Types.ObjectId(req.decode)).then(user=>{
        console.log(user);
        user.statistics.push(statistics);
       
        const promise = user.save();
        promise.then((data)=> {
            res.json(data);
            console.log(user);
        }).catch((err) => {
            res.json(err);
        });
    });

});

module.exports = router;
