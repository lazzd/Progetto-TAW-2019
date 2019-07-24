var express = require('express');
var router = express.Router();

let UsersModel = require('../models/users.model');

// require jsonwebtoken and bcrypt
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');

// verify for refreshing Token
let RefreshVerify = require('./verifyRefreshToken');

// const time tokens' expire
const AccessExpire = '7d';
const RefreshExpire = '7d';

// per validazione schema, fai in tutti i file
const { registerValidation, loginValidation } = require('../validation');

// funzione generica per creare JSON a seconda della chiamata effettuata
function createJwt(bodyJson) {
    // create the token , we can send information along jwt token
    // set the expire time of jwt
    const AccessToken = jwt.sign({
        _id: bodyJson.id,
        // insert the task of the user
        name: bodyJson.name,
        task: bodyJson.task
    }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: AccessExpire });
    // REFRESH TOKEN, LONGER DURATE
    const RefreshToken = jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: RefreshExpire });
    // set the header
    console.log(AccessToken);
    console.log(RefreshToken);
    //res.header('Access-Control-Expose-Headers', token).send(token);
    //inviamo il body vuoto, l'authorization si troverà nell'header della respose
    return ({ AccessToken, RefreshToken });
}

function refreshAccessJwt(bodyJson) {
    // create the token , we can send information along jwt token
    // set the expire time of jwt
    const AccessToken = jwt.sign({
        _id: bodyJson.id,
        // insert the task of the user
        name: bodyJson.name,
        task: bodyJson.task
    }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: AccessExpire });
    //res.header('Access-Control-Expose-Headers', token).send(token);
    //inviamo il body vuoto, l'authorization si troverà nell'header della respose
    return ({ AccessToken});
}

router.post("/register", async function (req, res, next) {
    try {
        if (!req.body)
            return res.status(400).send('Request body is missing');
        /*else if (!req.body.name || !req.body.email || !req.body.password || !req.body.task)
            return res.status(400).send('Missing parameters');*/
        else {
            // VALIDATE WITH JOI , guarda video per scrivere il documento
            //const validation = Joi.validate(req.body, schema);
            const { error } = registerValidation(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            // checking if the email already exists
            const emailExist = await UsersModel.findOne({ email: req.body.email });
            if (emailExist) return res.status(400).send('Email already exists');
            // controls OK
            // ------- per crypt HASH password

            // complessity of the string generate. The salt is the first part of the password
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);

            // metodi con controllo per le chiamate asincrone
            let model = new UsersModel(req.body);
            // change password with hashed password
            model.password = hashPassword;
            await model.save()
                .then(doc => {
                    if (!doc || doc.length === 0) {
                        return res.status(500).send(doc);
                    }
                    console.log(doc);
                    // ----------------------------------- nel doc dovrebbe esserci il _id necessario per il jwt, OK
                    const jwtToken = createJwt(doc);
                    return res.status(201).header('auth-token', jwtToken.AccessToken).type("application/json").send(jwtToken);

                })
                .catch(err => {
                    return res.status(500).json(err)
                });
        }
    } catch (err) {
        return res.status(400).send(err);
    }
});

// REFRESH-TOKEN V.2
router.post("/login", async function (req, res, next) {
    try {
        if (!req.body)
            return res.status(400).send('Request body is missing');
        /*else if (!req.body.email || !req.body.password)
            return res.status(400).send('Missing parameters');*/
        else {
            // VALIDATE WITH JOI , guarda video per scrivere il documento
            //const validation = Joi.validate(req.body, schema);
            const { error } = loginValidation(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            // checking if the email already exists
            const user = await UsersModel.findOne({ email: req.body.email });
            if (!user) return res.status(400).send("Email or Password is wrong");
            // checking if the password is OK
            const validPass = await bcrypt.compare(req.body.password, user.password);
            if (!validPass) return res.status(400).send('Invalid password');
            const jwtToken = createJwt(user);
            console.log(jwtToken);
            return res.status(201).header('auth-token', jwtToken.AccessToken).send(jwtToken);
            //posso qui inoltre salvarmi il token in localSession
            //res.send('Logged in');
        }
    } catch (err) {
        return res.status(400).send(err);
    }
});

// OK
router.post("/refresh-token", RefreshVerify, async function (req, res, next) {
    try {
        if (!req.body)
            return res.status(400).send('Request body is missing');
        else if (!req.body.AccessToken || !req.body.AccessToken)
            return res.status(400).send('Missing parameters');
        else {
            let decoded = jwt.decode(req.body.AccessToken);
            console.log(decoded);
            const jwtToken = refreshAccessJwt(decoded);
            return res.status(201).header('auth-token', jwtToken.AccessToken).send(jwtToken);
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send(err);
    }
});

module.exports = router;