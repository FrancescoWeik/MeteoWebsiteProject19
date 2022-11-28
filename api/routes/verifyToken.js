const jwt = require('jsonwebtoken');

//verify if token exists and return the id of the user corresponding to the user
module.exports = function(req,res,next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send({
        error : 'Auth access token denied'
    });

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch{
        res.status(403).send({
            error : 'Invalid Token'
        });
    }
}