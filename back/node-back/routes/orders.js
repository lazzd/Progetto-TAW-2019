var express = require('express');
var router = express.Router();

//import dishesModel
let ElementOrderModel = require('../models/element_order.model');
let OrdersModel = require('../models/orders.model');

// require jsonwebtoken
let jwt = require('jsonwebtoken');

// verify function
let verifyAccessToken = require('./verifyAccessToken');

// per validazione schema
const { orderValidation, elementOrderValidation } = require('../validation');

router.get("/", verifyAccessToken, async function (req, res, next) {
  try {
    await OrdersModel.find({})
      .then(doc => res.json(doc))
      .catch(err => res.status(500).json(err));
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get("/:id_order", verifyAccessToken, async function (req, res, next) {
  try {
    if (isNaN(req.params.id_order))
      return res.status(400).send("Id_order isn't a number");
    await OrdersModel.findOne({ id_order: req.params.id_order })
      .then(doc => res.json(doc))
      .catch(err => res.status(500).json(err));
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get("/:id_order/suborders", verifyAccessToken, async function (req, res, next) {
  try {
    if (isNaN(req.params.id_order))
      return res.status(400).send("Id_order isn't a number");
    await OrdersModel.findOne({ id_order: req.params.id_order })
      .then(doc => res.json(doc.elements_order))
      .catch(err => res.status(500).json(err));
  } catch (err) {
    return res.status(400).send(err);
  }
});

// OK
router.get("/:id_order/suborders/:id_suborder", verifyAccessToken, async function (req, res, next) {
  try {
    if (isNaN(req.params.id_order))
      return res.status(400).send("Id_order isn't a number");
    if (isNaN(req.params.id_suborder))
      return res.status(400).send("Id_suborder isn't a number");
    await OrdersModel.findOne({ id_order: req.params.id_order })
      .then(order => {
        if (isNaN(req.params.id_suborder))
          return res.status(400).send("Id_suborder isn't a number");
        if (req.params.id_suborder < 1 || req.params.id_suborder > order.num_suborders)
          return res.status(400).send("Id_suborder not present");
        const suborder = order.elements_order.find(obj => obj.id_suborder == req.params.id_suborder);
        return res.json(suborder);
      })
      .catch(err => res.status(500).json(err));
  } catch (err) {
    return res.status(400).send(err);
  }
});

// only users that are "..." can access in the post method
router.post("/", verifyAccessToken, async function (req, res, next) {
  try {
    if (!req.body)
      return res.status(400).send('Request body is missing');
    /*else if (!req.body.name_table || !req.body.seats)
      return res.status(400).send('Missing parameters');*/
    else {
      /*
  // serve validazione per ...
  const task = jwt.decode(req.header('auth-token')).task;
  console.log(task);
  if (task != '...')
      return res.status(400).send('Missing permissions');
  console.log(req.body);*/

      // vedere per la validazione

      const { error } = orderValidation(req.body);
      // problema nella validazione
      if (error) return res.status(400).send(error.details[0].message);
      // da vedere se è necessaria anche la find su un order non completed e già con quel nome del tavolo

      if (!req.body.drinks_order && !req.body.foods_order) {
        return res.status(400).send("No Order Request");
      }
      else {
        // vedere se ti butta giá dentro il table ed il waiter presenti nel body
        let model_element_order = new ElementOrderModel(req.body);
        if (!req.body.drinks_order)
          model_element_order.state.drinks_complete = true;
        if (!req.body.foods_order)
          model_element_order.state.foods_complete = true;
        let model = new OrdersModel(req.body);
        // first order with this id_order
        model.num_suborders = 1;
        model_element_order.id_suborder = model.num_suborders;
        model.elements_order.push(model_element_order);
        await model.save()
          .then(doc => {
            if (!doc || doc.length === 0) {
              return res.status(500).send(doc);
            }
            res.status(201).type("application/json").send(doc);
          })
          .catch(err => res.status(500).json(err));
      }
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.put("/:id_order", verifyAccessToken, async function (req, res, next) {
  try {
    if (isNaN(req.params.id_order))
      return res.status(400).send("Id_order isn't a number");
    if (!req.body)
      return res.status(400).send('Request body is missing');
    else {
      const { error } = elementOrderValidation(req.body);
      // problema nella validazione
      if (error) return res.status(400).send(error.details[0].message);
      if (!req.body.drinks_order && !req.body.foods_order) {
        return res.status(400).send("No Order Request");
      }
      else {
        const isOrderPresent = await OrdersModel.findOne({ id_order: req.params.id_order }, { state: false });
        if (!isOrderPresent) return res.status(400).send("Order isn't present");
        /*
        // serve validazione per Waiter
        const task = jwt.decode(req.header('auth-token')).task;
        //console.log(task);
        if (task == 'waiter')
          isOrderPresent.state.complete = req.body.state;
        else
          return res.status(400).send('Missing permissions');
        */
        let model_element_order = new ElementOrderModel(req.body);
        if (!req.body.drinks_order)
          model_element_order.state.drinks_complete = true;
        if (!req.body.foods_order)
          model_element_order.state.foods_complete = true;
        // update num suborders
        console.log(isOrderPresent.num_suborders);
        isOrderPresent.num_suborders += 1;
        model_element_order.id_suborder = isOrderPresent.num_suborders;
        isOrderPresent.elements_order.push(model_element_order);
        await isOrderPresent.save()
          .then(doc => {
            if (!doc || doc.length === 0) {
              return res.status(500).send(doc);
            }
            console.log(doc);
            res.status(201).type("application/json").send(doc);
          })
          .catch(err => res.status(500).json(err));
      }
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});

// OK
router.put("/:id_order/complete", verifyAccessToken, async function (req, res, next) {
  try {
    if (isNaN(req.params.id_order))
      return res.status(400).send("Id_order isn't a number");
    if (!req.body)
      return res.status(400).send('Request body is missing');
    else if (!req.body.state)
      return res.status(400).send('Missing parameters');
    else if (req.body.state != "false" && req.body.state != "true")
      // verifica se così o a stringa
      return res.status(400).send("Parameter isn't correct");
    else {
      // serve validazione per Cashier
      const task = jwt.decode(req.header('auth-token')).task;
      if (task != 'cashier')
        return res.status(400).send('Missing permissions');
      const isOrderPresent = await OrdersModel.findOne({ id_order: req.params.id_order });
      if (!isOrderPresent) return res.status(400).send("Order isn't present");
      isOrderPresent.complete = req.body.state;
      await isOrderPresent.save()
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

router.put("/:id_order/suborders/:id_suborder/complete", verifyAccessToken, async function (req, res, next) {
  try {
    if (isNaN(req.params.id_order))
      return res.status(400).send("Id_order isn't a number");
    if (!req.body)
      return res.status(400).send('Request body is missing');
    else if (!req.body.state)
      return res.status(400).send('Missing parameters');
    else if (req.body.state != "false" && req.body.state != "true")
      // verifica se così o a stringa
      return res.status(400).send("Parameter isn't correct");
    else {
      // serve validazione per Cashier
      const task = jwt.decode(req.header('auth-token')).task;
      console.log(task);
      if (task != 'cook' && task != 'barman')
        return res.status(400).send('Missing permissions');
      const isOrderPresent = await OrdersModel.findOne({ id_order: req.params.id_order });
      if (!isOrderPresent) return res.status(400).send("Order isn't present");
      if (req.params.id_suborder < 1 || req.params.id_suborder > isOrderPresent.num_suborders)
        return res.status(400).send("Id_suborder not present")
      const suborders = isOrderPresent.elements_order.find(obj => obj.id_suborder == req.params.id_suborder);
      (task == "cook") ? suborders.state.foods_complete = req.body.state : suborders.state.drinks_complete = req.body.state;
      await isOrderPresent.save()
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

// da aggiungere i PUT state per i barman, e cuochi e il cassiere per la terminazione in complete

module.exports = router;