var express = require('express');
var router = express.Router();

let UsersModel = require('../models/users.model');

// require jsonwebtoken
let jwt = require('jsonwebtoken');

// verify function
let verifyAccessToken = require('./verifyAccessToken');

router.get("/", verifyAccessToken, async function (req, res, next) {
    try {
        const task = jwt.decode(req.header('auth-token')).task;
        console.log(task);
        if (task != 'cashier')
            return res.status(400).send('Missing permissions');
        await UsersModel.find({})
            .then(doc => res.json(doc))
            .catch(err => res.status(500).json(err));
    } catch (err) {
        return res.status(400).send(err);
    }
});

module.exports = router;