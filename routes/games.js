const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ActiveGames = require('../modelsDB/ActiveGames');
const GameList = require('../modelsDB/GameList');
const User = require ('../modelsDB/User.js');

/* Bir Düello Oyuna Başlama */
router.post('/', function(req, res, next) {
  const {gameId, mode} = req.body;
  GameList.find({gameId : mongoose.Types.ObjectId(gameId)}).then(object =>{
   //Bu oyunun daha önceki ayarı var mı diye bakılır
    if(object==null || Object.keys(object).length === 0){
     
     res.status(400).json({"msg": "Bu Oyunu Oluşturamazsınız"});
    } //varsa 
 
     else{ 
      User.findById(mongoose.Types.ObjectId(req.decode)).then(user => {
        console.log(user.statistics);
        if(user.statistics == null || Object.keys(user.statistics).length === 0){ //kullanıcının daha önce statistics kaydı yoksa ilk kayıt eklenir
          user.statistics.push({gameId : mongoose.Types.ObjectId(object.gameId), league : 0, highestScore : 0, conditionRate : 0});
         const userPromise = user.save();
         userPromise.then(data => {
          console.log(data);
         }).catch(err=>{
          console.log(err);
         });
        }else{
          // eğer kaydı varsa, ve bu kayıttaki gameId, req.gameId ise, ligini alırız. 
          // eğer kaydı varsa, ve bu kayıttaki gameId, req.gameId değil ise yeni kayıt açarız.
        }

      }).catch(err => {
        console.log(err);
      });

      //burada daha önce aynı oyun aynı ligte oyun oluşturulmuş mu diye de bakılacak yoksa aşağıdaki işlem
      // eğer oyun modu 0 bu düzello modudur.  
      if(mode ==0){
        
      

     var activedPromise = ActiveGames.find({gameId : mongoose.Types.ObjectId(gameId), mode: mode, league: league });
     activedPromise.then(activedGameData => {
      if(activedGameData == null || Object.keys(activedGameData).length === 0){ //aktif oyun yoktur oluştururuz.
        const activeGames = new ActiveGames({gameId, 
          scoreCalculation : object.scoreCalculation,
          prize : object.prize,
          mode :0,
          league : 1
        });
       activeGames.players.push({"userId" : req.decode.id, "score" : 0});
        var date = new Date();
        date = Date.now();
        activeGames.endTime = date;
         const promise = activeGames.save();
        promise.then((data)=> {
          res.json(data);
        }).catch((err)=> {
          res.json(err);
        }); 
      } //
      else { //aktif oyun vardır
          //varsa direkt oyunun id'sini veririz
          res.json(activedGameData);
      }
     }).catch(err => {
      res.json(err);
     });


    }

    
      //lig eklenecek user'a ondan sonra devam edilecek.
      
      
     }
  
  }).catch(err=>{
    res.status(400).json(err);
    console.log(err);
    console.log("hata");
  });
});

module.exports = router;
