const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ActiveGames = require('../modelsDB/ActiveGames');
const GameList = require('../modelsDB/GameList');

/* Bir Düello Oyuna Başlama */
router.post('/', function(req, res, next) {
  const {gameId} = req.body;
  GameList.findById(mongoose.Types.ObjectId(gameId)).then(object =>{
    if(object==null){
     
     res.status(400).json({"msg": "Bu Oyunu Oluşturamazsınız"});
    }
     else{
      //burada daha önce aynı oyun aynı ligte oyun oluşturulmuş mu diye de bakılacak yoksa aşağıdaki işlem
      const activeGames = new ActiveGames({gameId, 
        scoreCalculation : object.scoreCalculation,
        prize : object.prize,
        mode :1,
        league : 1
      });
      var b = {"userId" : req.decode.id, "score" : 0};
    //  console.log(b);
      activeGames.players.push(b);
      var date = new Date(Date.now());
      console.log(date);
     
     date.setHours(date.getHours()+object.endTimeUp);
      activeGames.endTime = date;
      console.log(date);
      const promise = activeGames.save();
      promise.then((data)=> {
        res.json(data);
      }).catch((err)=> {
        res.json(err);
      });
      //lig eklenecek user'a ondan sonra devam edilecek.
      // res.json(activeGames);
      
     }
  
  }).catch(err=>{
    res.status(400).json(err);
    console.log(err);
    console.log("hata");
  });
});

module.exports = router;
