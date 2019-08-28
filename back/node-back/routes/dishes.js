var express = require('express');
var router = express.Router();

//import dishesModel
let DishesModel = require('../models/dishes.model');

// verify function
let verifyAccessToken = require('./verifyAccessToken');

/* GET all dishes page. */
router.get('/', async function (req, res, next) {
    try {
        await DishesModel.find({})
            .then(doc => res.json(doc))
            .catch(err => res.status(500).json(err));
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.get('/categories', async function (req, res, next) {
    try {
        if (req.query.category) {
            await DishesModel.find({ category: req.query.category })
                .then(doc => res.json(doc))
                .catch(err => res.status(500).json(err));
        }
        else {
            await DishesModel.aggregate([
                {
                    $group: {
                        _id: '$category',
                        entry: {
                            $push: {
                                name_dish: "$name_dish",
                                ingredients: "$ingredients",
                                id: "$id"
                            }
                        }
                    }
                }
            ], function (err, result) {
                if (err) {
                    next(err);
                } else {
                    res.json(result);
                }
            });
        }
    } catch (err) {
        return res.status(400).send(err);
    }
});

// CREATE new DISH
router.post('/', verifyAccessToken, async function (req, res, next) {
    try {
        if (!req.body)
            return res.status(400).send('Request body is missing');
        else if (!req.body.name_dish || !req.body.ingredients || !req.body.category)
            return res.status(400).send('Missing parameters');
        else {
            let model = new DishesModel(req.body);
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

// GET by id field
router.get('/:id', verifyAccessToken, async function (req, res, next) {
    try {
        let param_id = req.params.id;
        if (!param_id) {
            res.send("ERRORE");
        }
        else {
            await DishesModel.find({ id: param_id })
                .then(doc => res.json(doc))
                .catch(err => res.status(500).json(err));
        }
    } catch (err) {
        return res.status(400).send(err);
    }
});

module.exports = router;