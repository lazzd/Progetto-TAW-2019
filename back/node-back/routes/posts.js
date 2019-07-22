var express = require('express');
var router = express.Router();

let verify = require('./verifyAccessToken');

// dovresti mettere il try e catch per ogni richiesta

// EX to make private a route
router.get('/', verify, (req, res) => {
    console.log(req.user);
    res.json(
        {
            posts:
            {
                title: 'my first post',
                description: 'radom data'
            }
        });
});

module.exports = router;