const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ActiveGames = require('../modelsDB/ActiveGames');
const GameList = require('../modelsDB/GameList');
const User = require('../modelsDB/User.js');
const PastActivity = require('../modelsDB/PastActivity');
const Logs = require('../modelsDB/logs');
/* Bir Düello Oyuna Başlama */
router.post('/', function (req, res, next) {
  const { gameId, mode } = req.body;
  let league = 0;
  let uAvatar = "";
  let nicksname = "";
  GameList.findOne({ gameId: mongoose.Types.ObjectId(gameId) }).then(object => {
    //Bu oyunun daha önceki ayarı var mı diye bakılır
    if (object == null || Object.keys(object).length === 0) {
      res.status(400).json({ "msg": "Bu Oyunu Oluşturamazsınız" });
    } //varsa 
    else {
      User.findById(mongoose.Types.ObjectId(req.decode.id)).then(user => {
        uAvatar = user.avatar;
        nicksname = user.nickname;
        if (user.statistics == null || Object.keys(user.statistics).length === 0) {
          //kullanıcının daha önce statistics kaydı yoksa ilk kayıt eklenir
        //  console.log(user.avatar);
          user.statistics.push({ gameId: mongoose.Types.ObjectId(object.gameId), league: 0, highestScore: 0, conditionRate: 0, count : 0 });
          const userPromise = user.save();
          userPromise.then(data => {
        //    console.log(data);
          }).catch(err => {
            res.json("hata1");
          });
        } else {
          var s = user.statistics.filter(x => x.gameId == gameId); // bu oyunla alakalı data var mı
          if (s == null || Object.keys(s).length === 0) { //var
            league = s.league; // ligini alırız
          }
        }
      }).catch(err => {
      //  console.log(err);
      });

      //burada daha önce aynı oyun aynı ligte oyun oluşturulmuş mu diye de bakılacak yoksa aşağıdaki işlem
      // eğer oyun modu 0 bu eğitim modudur.   
      if (mode == 3) {
       // console.log(league);
        let activedPromise = ActiveGames.findOne({ gameId: mongoose.Types.ObjectId(gameId), mode: mode, league: league, "players.userId": { $ne: req.decode.id }, players: { $size: 1 } });
        activedPromise.then(activedGameData => {
          console.log("active",activedGameData);
          //console.log(activedGameData == null || Object.keys(activedGameData).length === 0);
          if (activedGameData == null || Object.keys(activedGameData).length === 0) { //aktif oyun yoktur oluştururuz.
            const activeGames = new ActiveGames({
              gameId,
              scoreCalculation: object.scoreCalculation,
              prize: object.prize,
              mode: mode,
              league: league
            });
            
            activeGames.players.push({ "userId": req.decode.id, "score": 0, "avatar": uAvatar, "nickname": nicksname });
            
            var date = new Date();
            date.setHours(object.endTimeUp + date.getHours());
          //  console.log(date);
            activeGames.endTime = date;
            const promise = activeGames.save();
            promise.then((data) => {
              res.json(data);
            }).catch((err) => {
              res.json("err2");
            });
          } //
          else { //aktif oyun vardır
           var s = activedGameData.players.filter(x => x.userId == req.decode.id);
            // console.log(s);
            // console.log("bişeytler");
            if (s == null || Object.keys(s).length === 0) {
              activedGameData.players.push({ "userId": req.decode.id, "score": 0, "avatar": uAvatar });
          
              const promise = activedGameData.save();
              promise.then((data) => {

              }).catch((err) => {
                res.json("er2r");
              });
            }

            //varsa direkt oyunun id'sini veririz
            res.json(activedGameData);
          }
        }).catch(err => {
          res.json("ersssr");
        });
      }
    }
  }).catch(err => {
    res.status(400).json(err);
   // console.log(err);
   // console.log("hata");
  });

  var a = req.body;
a["user"] = req.decode.id;
const logs = new Logs({
logs : a,
types: 3
});

const promise = logs.save();
promise.then((data)=>{
//console.log(data);
}).catch((err)=>{
//console.log(err);
});


});

router.get('/tournementDetail/:id', (req, res) => {
  ActiveGames.findById(mongoose.Types.ObjectId(req.params['id'])).then((activeGames) => {
    res.json(activeGames);
  }).catch((err) => {
    res.json(err);
  });
  var a = req.body;
  a["user"] = req.decode.id;
  const logs = new Logs({
  logs : a,
  types: 3
  });
  
  const promise = logs.save();
  promise.then((data)=>{
  console.log(data);
  }).catch((err)=>{
  console.log(err);
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
   
  }).catch((err) => {
    res.json(err);
  });
  var a = req.body;
  a["user"] = req.decode.id;
  const logs = new Logs({
  logs : a,
  types: 3
  });
  
  const promise = logs.save();
  promise.then((data)=>{
  console.log(data);
  }).catch((err)=>{
  console.log(err);
  });
});


router.post('/getGameData', (req, res) => {
  ActiveGames.findById(mongoose.Types.ObjectId(req.body.activeGameId)).then((activeGames) => {
    if(!activeGames.gameData)
      res.status(400).json({"status": "false"});
    else{
      res.json(activeGames.gameData);
    }    
  }).catch((err) => {
    res.json(err);
  });
  var a = req.body;
  a["user"] = req.decode.id;
  const logs = new Logs({
  logs : a,
  types: 3
  });
  
  const promise = logs.save();
  promise.then((data)=>{
  console.log(data);
  }).catch((err)=>{
  console.log(err);
  });
});

//javascript object array, object destruct, oyun bittiyse kapat
router.post('/finishGame', (req, res) => {
  const { score } = req.body;
  let userId = req.decode.id;
  ActiveGames.findOne({ _id: mongoose.Types.ObjectId(req.body.activeGameId), "players.userId": mongoose.Types.ObjectId(userId) }).then((activeGames) => {

    activeGames.players = activeGames.players.map((item) => {
      if (item.userId.toString() == mongoose.Types.ObjectId(userId).toString())
        return { ...item, score }
      return item
    })
    const promise = activeGames.save();
    promise.then((data) => {
      User.findById(req.decode.id).then((datap) => {
        datap.statistics = datap.statistics.map((item) => {
          
          if (item.gameId.toString() == mongoose.Types.ObjectId(data.gameId).toString()){
            console.log(item);
          if( item.highestScore < score)
            return { ...item, highestScore: score , count : item.count+1}
          return{...item,count : item.count+1}}
        })
        console.log(datap.statistics);

        const promiseJelly = datap.save();
        promiseJelly.then((data) => {
          console.log(data);
          console.log("ok");
        }).catch((err) => {
          console.log("err");
        })
      })
      res.json(data);
    }).catch((err) => {
      res.json(err);
    })
    //  console.log('backUp data',backUp);

  }).catch((err) => {
    res.json(err);
  });
  var a = req.body;
  a["user"] = req.decode.id;
  const logs = new Logs({
  logs : a,
  types: 3
  });
  
  const promise = logs.save();
  promise.then((data)=>{
  console.log(data);
  }).catch((err)=>{
  console.log(err);
  });
});


router.get('/playerSort/:id', (req, res) => {
  ActiveGames.find({ _id: req.params['id'] }).sort('players.scores').exec(function (err, docs) {
    res.json(docs);
  });
  var a = req.body;
  a["user"] = req.decode.id;
  const logs = new Logs({
  logs : a,
  types: 3
  });
  
  const promise = logs.save();
  promise.then((data)=>{
  console.log(data);
  }).catch((err)=>{
  console.log(err);
  });
});

router.get('/myActiveGames', (req, res) => {
  ActiveGames.find({ "players.userId": req.decode.id }).then((activeGames) => {
    console.log(activeGames);
    res.json({ "activeGames": activeGames });
  }).catch((err) => {
    res.json(err);
  });
  var a = req.body;
  a["user"] = req.decode.id;
  const logs = new Logs({
  logs : a,
  types: 3
  });
  
  const promise = logs.save();
  promise.then((data)=>{
  console.log(data);
  }).catch((err)=>{
  console.log(err);
  });
});

router.get('/mostPlayedGames',(req, res) =>{
  User.findById(mongoose.Types.ObjectId(req.decode.id)).then((user)=>{
    console.log(user.statistics);
    if(user.statistics==null|| Object.keys(user.statistics).length===0){
      res.status(404).json({"msg:":"En çok oynanan oyunlar bulunamadı."});
    }
    
    var a = user.statistics;
   let sorted = a.sort((a,b) => b.count - a.count)
    res.json(sorted);
  
  }).catch((err)=>{
    res.json(err);
  });
  var a = req.body;
  a["user"] = req.decode.id;
  const logs = new Logs({
  logs : a,
  types: 3
  });
  
  const promise = logs.save();
  promise.then((data)=>{
  console.log(data);
  }).catch((err)=>{
  console.log(err);
  });
});
module.exports = router;
