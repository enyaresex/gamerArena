const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ActiveGames = require('../modelsDB/ActiveGames');
const GameList = require('../modelsDB/GameList');
const User = require('../modelsDB/User.js');

/* Bir Düello Oyuna Başlama */
router.post('/', function (req, res, next) {
  const { gameId, mode } = req.body;
  let league = 0;
  let uAvatar = "";
  GameList.findOne({ gameId: mongoose.Types.ObjectId(gameId) }).then(object => {
    //Bu oyunun daha önceki ayarı var mı diye bakılır
    if (object == null || Object.keys(object).length === 0) {
      res.status(400).json({ "msg": "Bu Oyunu Oluşturamazsınız" });
    } //varsa 
    else {
      User.findById(mongoose.Types.ObjectId(req.decode.id)).then(user => {
        uAvatar = user.avatar;
        if (user.statistics == null || Object.keys(user.statistics).length === 0) {
          //kullanıcının daha önce statistics kaydı yoksa ilk kayıt eklenir
          console.log(user.avatar);
          user.statistics.push({ gameId: mongoose.Types.ObjectId(object.gameId), league: 0, highestScore: 0, conditionRate: 0 });
          const userPromise = user.save();
          userPromise.then(data => {
            console.log(data);
          }).catch(err => {
            res.json(err);
          });
        } else {
          var s = user.statistics.filter(x => x.gameId == gameId); // bu oyunla alakalı data var mı
          if (s == null || Object.keys(s).length === 0) { //var
            league = s.league; // ligini alırız
          }
        }
      }).catch(err => {
        console.log(err);
      });

      //burada daha önce aynı oyun aynı ligte oyun oluşturulmuş mu diye de bakılacak yoksa aşağıdaki işlem
      // eğer oyun modu 0 bu eğitim modudur.   
      if (mode == 3) {
        console.log(league);
        var activedPromise = ActiveGames.findOne({ gameId: mongoose.Types.ObjectId(gameId), mode: mode, league: league, "players.userId": { $ne: req.decode.id }, players: { $size: 1 } });
        activedPromise.then(activedGameData => {
          // console.log(activedGameData);
          if (activedGameData == null || Object.keys(activedGameData).length === 0) { //aktif oyun yoktur oluştururuz.
            const activeGames = new ActiveGames({
              gameId,
              scoreCalculation: object.scoreCalculation,
              prize: object.prize,
              mode: mode,
              league: league
            });

            activeGames.players.push({ "userId": req.decode.id, "score": 0, "avatar": uAvatar });
            console.log(activeGames);
            var date = new Date();
            date.setHours(object.endTimeUp + date.getHours());
            console.log(date);
            activeGames.endTime = date;
            const promise = activeGames.save();
            promise.then((data) => {
              res.json(data);
            }).catch((err) => {
              res.json(err);
            });
          } //
          else { //aktif oyun vardır
            var s = activedGameData.players.filter(x => x.userId == req.decode.id);
            console.log(s);
            if (s == null || Object.keys(s).length === 0) {
              activedGameData.players.push({ "userId": req.decode.id, "score": 0, "avatar": uAvatar });
              console.log("s");
              const promise = activedGameData.save();
              promise.then((data) => {

              }).catch((err) => {
                res.json(err);
              });
            }

            //varsa direkt oyunun id'sini veririz
            res.json(activedGameData);
          }
        }).catch(err => {
          res.json(err);
        });
      }
    }

  }).catch(err => {
    res.status(400).json(err);
    console.log(err);
    console.log("hata");
  });
});

router.get('/tournementDetail/:id', (req, res) => {
  ActiveGames.findById(mongoose.Types.ObjectId(req.params['id'])).then((activeGames) => {
    res.json(activeGames);
  }).catch((err) => {
    res.json(err);
  });
});


router.post('/addNewGameData', (req, res) => {
  ActiveGames.findById(mongoose.Types.ObjectId(req.body.activeGameId)).then((activeGames) => {
    activeGames.gameData = req.body.gameData;
    activeGames.save((err, data) => {
      if (err)
        res.json(err);
      res.json(data);
    });
    res.json(activeGames);
  }).catch((err) => {
    res.json(err);
  });
});
//javascript object array, object destruct, oyun bittiyse kapat
router.post('/finishGame', (req, res) => {
  const { score } = req.body;
  let  userId = req.decode.id;
  ActiveGames.findOne({ id: mongoose.Types.ObjectId(req.body.activeGameId), "players.userId": mongoose.Types.ObjectId(userId) }).then((activeGames) => {
   
    activeGames.players = activeGames.players.map((item) => {
      if (item.userId.toString() == mongoose.Types.ObjectId(userId).toString()) 
        return {...item,score}
        return item
    })
    const promise = activeGames.save();
    promise.then((data)=>{
      res.json(data);
    }).catch((err)=>{
      res.json(err);
    })
  //  console.log('backUp data',backUp);
   
  }).catch((err) => {
    res.json(err);
  });
});

router.get('/playerSort/:id',(req,res)=>{
  ActiveGames.find({_id:req.params['id']}).sort('players.scores').exec(function(err,docs){
    res.json(docs);
  });
});

router.get('/myActiveGames',(req,res)=>{
  ActiveGames.find({"players.userId": req.decode.id}).then((activeGames)=> {
    console.log(activeGames);
    res.json({"activeGames" : activeGames});
  }).catch((err)=>{
    res.json(err);
  })
});
module.exports = router;
