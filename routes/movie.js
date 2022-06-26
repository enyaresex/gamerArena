const express = require('express');
const router = express.Router();

const Movie = require('../modelsDB/Movie');
router.get('/',(req,res)=>{
    const promise = Movie.find({});
    promise.then((data)=>{
        res.json(data);

    }).catch((err)=>{
        res.json(err);
    })
});

router.get('/movieSort',(req,res,)=>{
  Movie.find({}).sort('year').exec(function(err, docs) {
     res.json(docs);
    });
})

router.post('/', (req, res, next)=> {
 // const {title,imdb_score,category,country,year} = req.body;
  const movie = new Movie(req.body);
  movie.save((err,data)=>{
    if(err)
       res.json(err);
    res.json(data);
  });
});


router.get('/search',(req,res)=>{
  const {year,title}=req.body;
  Movie.find({year:year,title:title},(err, data)=>{
    res.json(data);
  });
});



module.exports = router;