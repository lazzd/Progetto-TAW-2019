var express = require('express');
var router = express.Router();

//import dishesModel
let TablesModel = require('../models/tables.model');

// require jsonwebtoken
let jwt = require('jsonwebtoken');

// verify function
let verifyAccessToken = require('./verifyAccessToken');

// per validazione schema
const { tableValidation } = require('../validation');

router.get("/", verifyAccessToken, async function (req, res, next) {
    try {
        // search by seats
        if (req.query.seats) {
            if (isNaN(req.query.seats))
                return res.status(400).send("Id_order isn't a number");
            await TablesModel.find({ $and: [{ seats: { $gte: req.query.seats } }, { busy: false }] })
                .then(doc => res.json(doc))
                .catch(err => res.status(500).json(err));
        }
        else {
            await TablesModel.find({})
                .then(doc => res.json(doc))
                .catch(err => res.status(500).json(err));
        }
    } catch (err) {
        return res.status(400).send(err);
    }
});

// GET by id field
router.get('/:name_table', verifyAccessToken, async function (req, res, next) {
    try {
        await TablesModel.find({ name_table: req.params.name_table })
            .then(doc => res.json(doc))
            .catch(err => res.status(500).send(err));

        /*
        let param_name_table = req.params.name_table;
        //Se non presente l'id NON dovrebbe mai cadere qui dentro per la presenza del GET all without id. Array vuoto, no vuoto
        if (!param_name_table) {
            return res.status(400).send('Missing parameters');
        }
        else {
            await TablesModel.find({ name_table: param_name_table })
                .then(doc => res.json(doc))
                .catch(err => res.status(500).send(err));
        }
        */
    } catch (err) {
        return res.status(400).send(err);
    }
});

// only users that are "Cashier" can access in the post method
router.post("/", verifyAccessToken, async function (req, res, next) {
    try {
        if (!req.body)
            return res.status(400).send('Request body is missing');
        /*else if (!req.body.name_table || !req.body.seats)
            return res.status(400).send('Missing parameters');*/
        else {
            // serve validazione per Cashier
            const task = jwt.decode(req.header('auth-token')).task;
            console.log(task);
            if (task != 'cashier')
                return res.status(400).send('Missing permissions');
            console.log(req.body);
            const { error } = tableValidation(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            const isTablePresent = await TablesModel.findOne({ name_table: req.body.name_table });
            if (isTablePresent) return res.status(400).send("Table name is already present");
            let model = new TablesModel(req.body);
            await model.save()
                .then(doc => {
                    if (!doc || doc.length === 0) {
                        return res.status(500).send(doc);
                    }
                    console.log(doc);
                    res.status(201).type("application/json").send(doc);
                })
                .catch(err => res.status(500).json(err));
        }
    } catch (err) {
        return res.status(400).send(err);
    }
});

// update state of PUT by waiter
router.put("/:name_table", verifyAccessToken, async function (req, res, next) {
    try {
        if (!req.body)
            return res.status(400).send('Request body is missing');
        else if (!req.body.state)
            return res.status(400).send('Missing parameters');
        else if (req.body.state != false && req.body.state != true)
            // verifica se così o a stringa
            return res.status(400).send("Parameter isn't correct");
        else {
            // serve validazione per Waiter
            const task = jwt.decode(req.header('auth-token')).task;
            console.log(task);
            if (task != 'waiter')
                return res.status(400).send('Missing permissions');
            const isTablePresent = await TablesModel.findOne({ name_table: req.params.name_table });
            if (!isTablePresent) return res.status(400).send("Table name isn't already present");
            isTablePresent.busy = req.body.state;
            await isTablePresent.save()
                .then(doc => {
                    if (!doc || doc.length === 0) {
                        return res.status(500).send(doc);
                    }
                    console.log(doc);
                    res.status(201).type("application/json").send(doc);
                })
                .catch(err => res.status(500).json(err));
        }
    } catch (err) {
        return res.status(400).send(err);
    }
});

module.exports = router;