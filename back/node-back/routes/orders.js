var express = require('express');
var router = express.Router();

//import dishesModel
let OrdersModel = require('../models/orders.model');

// verify function
let verifyAccessToken = require('./verifyAccessToken');

router.get("/", verifyAccessToken, async function (req, res, next) {
  try {
    await OrdersModel.find({})
      .then(doc => res.json(doc))
      .catch(err => res.status(500).json(err));
  } catch (err) {
    return res.status(400).send(err);
  }
});

// da sistemare
router.post("/", async function (req, res, next) {
  if (!req.body) return res.status(400).send("Request body is missing");
  /*else if (!req.body.category)
    return res.status(400).send("Missing parameters");*/
  else {
    let model = new OrdersModel(req.body);
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
});

module.exports = router;