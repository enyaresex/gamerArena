const express = require('express');
const router = express.Router();

const GameList = require('../modelsDB/GameList');

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

module.exports = router;
