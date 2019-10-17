var express = require('express');
var router = express.Router();

let UsersModel = require('../models/users.model');

// require jsonwebtoken and bcrypt
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');

// verify function
let verifyAccessToken = require('./verifyAccessToken');

// verify for refreshing Token
let RefreshVerify = require('./verifyRefreshToken');

// const time tokens' expire
const AccessExpire = '300000';
const RefreshExpire = '7d';

// per validazione schema, fai in tutti i file
const { registerValidation, loginValidation } = require('../validation');

// funzione generica per creare JSON a seconda della chiamata effettuata
function createTokens(bodyJson) {
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
    const RefreshToken = jwt.sign({
        _id: bodyJson.id,
        name: bodyJson.name
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: RefreshExpire });
    // set the header
    console.log(AccessToken);
    console.log(RefreshToken);
    //inviamo il body vuoto, l'authorization si troverà nell'header della respose
    return ({ AccessToken, RefreshToken });
}

function refreshAccessToken(bodyJson) {
    // create the token , we can send information along jwt token
    // set the expire time of jwt
    const AccessToken = jwt.sign({
        _id: bodyJson.id,
        // insert the task of the user
        name: bodyJson.name,
        task: bodyJson.task
    }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: AccessExpire });
    //inviamo il body vuoto, l'authorization si troverà nell'header della respose
    return ({ AccessToken });
}

router.post("/register", verifyAccessToken, async function (req, res, next) {
    try {
        if (!req.body)
            return res.status(400).send('Request body is missing');
        else {
            const task = jwt.decode(req.header('auth-token')).task;
            if (task != 'cashier')
                return res.status(400).send('Missing permissions');
            // VALIDATE WITH JOI
            const { error } = registerValidation(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            // checking if the email already exists
            const emailExist = await UsersModel.findOne({ email: req.body.email });
            if (emailExist) return res.status(400).send('Email already exists');
            const nameExist = await UsersModel.findOne({ name: req.body.name });
            if (nameExist) return res.status(400).send('Name already exists');
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
                    const jwtToken = createTokens(doc);
                    res.io.emit("new-user-action", doc);
                    return res.status(201).send("Registration completed");

                })
                .catch(err => {
                    return res.status(500).json(err)
                });
        }
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.post("/login", async function (req, res, next) {
    try {
        if (!req.body)
            return res.status(400).send('Request body is missing');
        else {
            // VALIDATE WITH JOI
            const { error } = loginValidation(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            // checking if the email already exists
            const user = await UsersModel.findOne({ email: req.body.email });
            if (!user) return res.status(400).send("Email or Password is wrong");
            // checking if the password is OK
            const validPass = await bcrypt.compare(req.body.password, user.password);
            if (!validPass) return res.status(400).send('Invalid password');
            const jwtToken = createTokens(user);
            console.log(jwtToken);
            user.RefreshToken = jwtToken.RefreshToken;
            await user.save()
                .then(doc => {
                    if (!doc || doc.length === 0) {
                        return res.status(500).send(doc);
                    }
                    res.status(201).header('auth-token', jwtToken.AccessToken).send(jwtToken);
                })
                .catch(err => res.status(500).json(err));
        }
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.post("/logout", async function (req, res, next) {
    try {
        // il body deve contere il RefreshToken
        if (!req.body)
            return res.status(400).send('Request body is missing');
        else {
            console.log(req.body)
            // Il refresh Token usati univoci? Altrimenti Find e poi map
            const user = await UsersModel.findOne({ name: req.body.UserName });
            if (user) {
                user.RefreshToken = null;
                await user.save()
                    .then(doc => {
                        if (!doc || doc.length === 0) {
                            return res.status(500).send(doc);
                        }
                        res.status(201).send({});
                    })
                    .catch(err => res.status(500).json(err));
            }
            else {
                return res.status(201).send("Logout");
            }
        }
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.post("/refreshToken", RefreshVerify, async function (req, res, next) {
    try {
        if (!req.body)
            return res.status(400).send('Request body is missing');
        else if (!req.body.AccessToken || !req.body.RefreshToken)
            return res.status(400).send('Missing parameters');
        else {
            const decRefreshToken = jwt.decode(req.body.RefreshToken);
            const nameRT = decRefreshToken.name;
            const user = await UsersModel.findOne({ name: nameRT });
            if (user) {
                if (user.RefreshToken == req.body.RefreshToken) {
                    console.log("LE STRINGHE MATCHANO SU RT");
                    const decAccessToken = jwt.decode(req.body.AccessToken);
                    const jwtToken = refreshAccessToken(decAccessToken);
                    return res.status(201).header('auth-token', jwtToken.AccessToken).send(jwtToken);
                }
                else {
                    return res.status(201).send({"error": "RefreshToken doens't match with DB"});
                }
            }
            else {
                return res.status(201).send({"error": "User doesn't present in DB"});
            }
            // controllo DB if RefreshToken is present
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send(err);
    }
});

module.exports = router;