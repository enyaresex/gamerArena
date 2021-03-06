const express = require('express');
const router = express.Router();

const Game = require('../modelsDB/Game');
const uuid = require('uuid');
const multer = require('multer');
const mongoose = require('mongoose');
let userGuid;
const fs = require('fs');
const Logs = require('../modelsDB/logs');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.body.name);
    cb(null, './gameImages/')
  },
  filename: function (req, file, cb) {
    
    userGuid = uuid.v1()+file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    cb(null, userGuid);
     }
});
/* Bir oyun ayarı kaydetme */
router.post('/', function(req, res, next) {
    const {gameId,endTimeUp,prize,scoreCalculation} = req.body;
    const gameList = new GameList({
        gameId,
        endTimeUp,
        prize,
        scoreCalculation
    });

    const promise = gameList.save();
    promise.then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err);
    });
});
//oyun tanımlama
const upload = multer({storage: storage})
router.post('/addNewGame', upload.single('profile'), function(req, res, next) {
     req.body = JSON.parse(JSON.stringify(req.body));
 
    const {name, code, url} = req.body;
    const avatar = userGuid;
    const game = new Game({
name,
code,
url,
avatar
    });
 
    const promise = game.save();
    promise.then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err);
    });
});

router.get('/getGames', function(req, res, next) {
    
    Game.find().then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err);
    })
});

router.get('/getLogs', function(req, res, next) {
    
    Logs.find().then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err);
    });

});



module.exports = router;
