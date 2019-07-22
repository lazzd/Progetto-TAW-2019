let jwt = require('jsonwebtoken');

// il salvataggio del cookie deve essere client side
// exec on every private router
module.exports = function(req, res, next){
    const RefreshToken = req.body.RefreshToken;
    if(!RefreshToken) return res.status(400).send('Request body is missing');
    try{
        const verified = jwt.verify(RefreshToken, process.env.REFRESH_TOKEN_SECRET);
        req.user = verified;
        next();
    } catch(err){
        // imposta tutti problemi
        console.log(err);
        res.status(400).send(err.name);
    }
}