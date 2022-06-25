const jwt = require('jsonwebtoken');

module.exports =(req, res, next) =>{
    const token = req.headers['x-access-token'] || req.body.token || req.query.token


if(token){
    jwt.verify(token, req.app.get('api_secret_key'), (err, decoded) =>{
        if(err){
          res.status(400).json({
            "msg" : "Oturum Süresi Doldu",
            "detail": "yumuşak burun dalar kazar bedirhan"
          }); 
        }else {
            req.decode = decoded;
            next();
        }
    } );
}else{
    res.status(400).json({
        "msg" : "Token Bulunamadı",
        "detail": "yumuşak burun dalar kazar bedirhan"
      });      
}
};
        