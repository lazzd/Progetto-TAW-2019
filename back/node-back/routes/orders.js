var express = require('express');
var router = express.Router();

//import dishesModel
let ElementOrderModel = require('../models/element_order.model');
let MenuModel = require('../models/menu.model');
let UsersModel = require('../models/users.model');
let OrdersModel = require('../models/orders.model');
let TablesModel = require('../models/tables.model');

// require jsonwebtoken
let jwt = require('jsonwebtoken');

// verify function
let verifyAccessToken = require('./verifyAccessToken');

// per validazione schema
const { orderValidation, elementOrderValidation } = require('../validation');

router.get("/", verifyAccessToken, async function (req, res, next) {
    try {
        const task = jwt.decode(req.header('auth-token')).task;
        if (task == 'cook') {
            await OrdersModel.find({ 'state_order.complete': false, 'state_order.all_foods_complete': false })
                .then(array => {
                    for (let i = 0; i < array.length; ++i) {
                        array[i].elements_order = array[i].elements_order.filter(sub_order => sub_order.employees.foods_employee == null);
                    }
                    res.json(array)
                })
                .catch(err => res.status(500).json(err));
        }
        else if (task == 'barman') {
            await OrdersModel.find({ 'state_order.complete': false, 'state_order.all_drinks_complete': false })
                .then(array => {
                    for (let i = 0; i < array.length; ++i) {
                        array[i].elements_order = array[i].elements_order.filter(sub_order => sub_order.employees.drinks_employee == null);
                    }
                    res.json(array)
                })
                .catch(err => res.status(500).json(err));
        }
        else if (task == 'cashier') {
            if (req.query.date) {
                const start = new Date(req.query.date);
                const end = new Date(start.getTime() + 86400000);
                await OrdersModel.find({ date: { $gte: start, $lt: end }, 'state_order.complete': true })
                    .then(doc => res.json(doc))
                    .catch(err => res.status(500).json(err));
            }
            else
                await OrdersModel.find({ 'state_order.complete': false })
                    .then(doc => res.json(doc))
                    .catch(err => res.status(500).json(err));
        }
        else {
            await OrdersModel.find({})
                .then(doc => res.json(doc))
                .catch(err => res.status(500).json(err));
        }
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.get("/myOrders", verifyAccessToken, async function (req, res, next) {
    try {
        const task = jwt.decode(req.header('auth-token')).task;
        if (task == 'cook') {
            const name = jwt.decode(req.header('auth-token')).name;
            await OrdersModel.find({ 'state_order.complete': false, 'state_order.all_foods_complete': false })
                .then(array => {
                    for (let i = 0; i < array.length; ++i) {
                        array[i].elements_order = array[i].elements_order.filter(sub_order => sub_order.state.foods_complete == false && sub_order.employees.foods_employee == name);
                    }
                    res.json(array)
                })
                .catch(err => res.status(500).json(err));
        }
        else if (task == 'barman') {
            const name = jwt.decode(req.header('auth-token')).name;
            await OrdersModel.find({ 'state_order.complete': false, 'state_order.all_drinks_complete': false })
                .then(array => {
                    for (let i = 0; i < array.length; ++i) {
                        array[i].elements_order = array[i].elements_order.filter(sub_order => sub_order.state.drinks_complete == false && sub_order.employees.drinks_employee == name);
                    }
                    res.json(array)
                })
                .catch(err => res.status(500).json(err));
        }
        else if (task == 'waiter') {
            const name = jwt.decode(req.header('auth-token')).name;
            await OrdersModel.find({ waiter: name, 'state_order.complete': false, 'state_order.all_served': false })
                .then(array => {
                    res.json(array)
                })
                .catch(err => res.status(500).json(err));
        }
        else {
            return res.status(400).send('Missing permissions');
        }
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

router.get("/:id_order/suborders/:id_suborder", verifyAccessToken, async function (req, res, next) {
    try {
        if (isNaN(req.params.id_order))
            return res.status(400).send("Id_order isn't a number");
        if (isNaN(req.params.id_suborder))
            return res.status(400).send("Id_suborder isn't a number");
        await OrdersModel.findOne({ id_order: req.params.id_order })
            .then(order => {
                const suborder = order.elements_order.find(obj => obj.id_suborder == req.params.id_suborder);
                if (!suborder)
                    return res.status(400).send("Id_suborder isn't present");
                return res.json(suborder);
            })
            .catch(err => res.status(500).json(err));
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.put("/:id_order/suborders/:id_suborder", verifyAccessToken, async function (req, res, next) {
    try {
        if (isNaN(req.params.id_order))
            return res.status(400).send("Id_order isn't a number");
        if (isNaN(req.params.id_suborder))
            return res.status(400).send("Id_suborder isn't a number");
        if (!req.body)
            return res.status(400).send('Request body is missing');
        else if (!req.body.name)
            return res.status(400).send('Missing parameters');
        else {
            // serve validazione per Cashier
            const task = jwt.decode(req.header('auth-token')).task;
            if (task != 'cook' && task != 'barman')
                return res.status(400).send('Missing permissions');
            const isOrderPresent = await OrdersModel.findOne({ id_order: req.params.id_order });
            if (!isOrderPresent) return res.status(400).send("Order isn't present");
            const suborder = isOrderPresent.elements_order.find(obj => obj.id_suborder == req.params.id_suborder);
            console.log("qui");
            console.log(suborder);
            if (!suborder)
                return res.status(400).send("Id_suborder isn't present");
            if (task == 'barman')
                suborder.employees.drinks_employee = req.body.name;
            if (task == 'cook')
                suborder.employees.foods_employee = req.body.name;
            await isOrderPresent.save()
                .then(doc => {
                    if (!doc || doc.length === 0) {
                        return res.status(500).send(doc);
                    }
                    if (task == 'barman') {
                        res.io.emit("take-suborder", "A BARMAN take the first suborder");
                    }
                    if (task == 'cook') {
                        res.io.emit("take-suborder", "A COOK take the first suborder");
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

// only users that are "..." can access in the post method
router.post("/", verifyAccessToken, async function (req, res, next) {
    try {
        if (!req.body)
            return res.status(400).send('Request body is missing');
        else {
            const { error } = orderValidation(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            if (!req.body.drinks_order && !req.body.foods_order) {
                return res.status(400).send("No Order Request");
            }
            else {
                // verify if elementMenu item are present in mongo
                const drinks_order = req.body.drinks_order;
                if (drinks_order) {
                    for (let elem of drinks_order) {
                        let category = await MenuModel.findOne({ category: elem.category });
                        if (!category)
                            return res.status(400).send("Not all drink's category are present in DB");
                        let isPresent = category.elements_category.some(ElementMenu => ElementMenu.name_element_menu == elem.name_element_menu);
                        if (!isPresent)
                            return res.status(400).send("Not all drinks are present in DB");
                    }
                }
                const foods_order = req.body.foods_order;
                if (foods_order) {
                    for (let elem of foods_order) {
                        let category = await MenuModel.findOne({ category: elem.category });
                        if (!category)
                            return res.status(400).send("Not all food's category are present in DB");
                        let isPresent = category.elements_category.some(ElementMenu => ElementMenu.name_element_menu == elem.name_element_menu);
                        if (!isPresent)
                            return res.status(400).send("Not all foods are present in DB");
                    }
                }
                let model = new OrdersModel(req.body);
                // first order with this id_order
                model.num_suborders = 1;
                let model_element_order = new ElementOrderModel(req.body);
                if (!req.body.drinks_order) {
                    model_element_order.state.drinks_complete = true;
                    model_element_order.state.drinks_served = true;
                    model.state_order.all_drinks_complete = true;
                }
                if (!req.body.foods_order) {
                    model_element_order.state.foods_complete = true;
                    model_element_order.state.foods_served = true;
                    model.state_order.all_foods_complete = true;
                }
                model.elements_order.push(model_element_order);
                // ---------------- Aggiunta id a tavolo
                const isTablePresent = await TablesModel.findOne({ name_table: req.body.table });
                if (!isTablePresent) return res.status(400).send("Table name isn't present");
                // ----------------
                await model.save()
                    .then(async doc => {
                        if (!doc || doc.length === 0) {
                            return res.status(500).send(doc);
                        }
                        isTablePresent.id_order = doc.id_order;
                        await isTablePresent.save()
                            .then(tab => {
                                if (!tab || tab.length === 0) {
                                    return res.status(500).send(doc);
                                }
                                res.io.emit("new-suborder", doc);
                                res.status(201).type("application/json").send(doc);
                            })
                            .catch(err => res.status(500).json(err));
                    })
                    .catch(err => res.status(500).json(err));
            }
        }
    } catch (err) {
        console.log(err);
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
            if (error) return res.status(400).send(error.details[0].message);
            if (!req.body.drinks_order && !req.body.foods_order) {
                return res.status(400).send("No Order Request");
            }
            else {
                const isOrderPresent = await OrdersModel.findOne({ id_order: req.params.id_order }, { state: false });
                if (!isOrderPresent) return res.status(400).send("Order isn't present");
                const drinks_order = req.body.drinks_order;
                if (drinks_order) {
                    for (let elem of drinks_order) {
                        let category = await MenuModel.findOne({ category: elem.category });
                        if (!category)
                            return res.status(400).send("Not all drink's category are present in DB");
                        let isPresent = category.elements_category.some(ElementMenu => ElementMenu.name_element_menu == elem.name_element_menu);
                        if (!isPresent)
                            return res.status(400).send("Not all drinks are present in DB");
                    }
                }
                const foods_order = req.body.foods_order;
                if (foods_order) {
                    for (let elem of foods_order) {
                        let category = await MenuModel.findOne({ category: elem.category });
                        if (!category)
                            return res.status(400).send("Not all food's category are present in DB");
                        let isPresent = category.elements_category.some(ElementMenu => ElementMenu.name_element_menu == elem.name_element_menu);
                        if (!isPresent)
                            return res.status(400).send("Not all foods are present in DB");
                    }
                }
                let model_element_order = new ElementOrderModel(req.body);
                if (!req.body.drinks_order) {
                    model_element_order.state.drinks_complete = true;
                    model_element_order.state.drinks_served = true;
                }
                if (!req.body.foods_order) {
                    model_element_order.state.foods_complete = true;
                    model_element_order.state.foods_served = true;
                }
                //isOrderPresent.num_suborders += 1;
                model_element_order.id_suborder = isOrderPresent.num_suborders;
                isOrderPresent.elements_order.push(model_element_order);
                if (isOrderPresent.state_order.all_served)
                    isOrderPresent.state_order.all_served = false;
                if (req.body.drinks_order && isOrderPresent.state_order.all_drinks_complete)
                    isOrderPresent.state_order.all_drinks_complete = false;
                if (req.body.foods_order && isOrderPresent.state_order.all_foods_complete)
                    isOrderPresent.state_order.all_foods_complete = false;
                await isOrderPresent.save()
                    .then(doc => {
                        if (!doc || doc.length === 0) {
                            return res.status(500).send(doc);
                        }
                        console.log(doc);
                        res.io.emit("new-suborder", doc);
                        res.status(201).type("application/json").send(doc);
                    })
                    .catch(err => res.status(500).json(err));
            }
        }
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.put("/:id_order/complete", verifyAccessToken, async function (req, res, next) {
    try {
        if (isNaN(req.params.id_order))
            return res.status(400).send("Id_order isn't a number");
        if (!req.body)
            return res.status(400).send('Request body is missing');
        else if (!req.body.state)
            return res.status(400).send('Missing parameters');
        else if (req.body.state != false && req.body.state != true)
            return res.status(400).send("Parameter isn't correct");
        else {
            // serve validazione per Cashier
            const task = jwt.decode(req.header('auth-token')).task;
            if (task != 'cashier')
                return res.status(400).send('Missing permissions');
            const isOrderPresent = await OrdersModel.findOne({ id_order: req.params.id_order });
            if (!isOrderPresent) return res.status(400).send("Order isn't present");
            // CONTROLLO LATO BACK AND AUTO PER SET COMPLETE A TRUE, ORA DA FARE CON IL SERVED
            if (req.body.state) {
                isOrderPresent.state_order.complete = req.body.state;
            }
            else {
                isOrderPresent.state_order.complete = req.body.state;
            }
            const name = jwt.decode(req.header('auth-token')).name;
            const isUserPresent = await UsersModel.findOne({ name: name });
            if (!isUserPresent) return res.status(400).send("User isn't present");
            isUserPresent.actions += 1;
            await isUserPresent.save()
                .then(async doc => {
                    if (!doc || doc.length === 0) {
                        return res.status(500).send(doc);
                    }
                    console.log(doc);
                    res.io.emit("new-user-action", doc);
                    console.log("IS ORDER PRESENT", isUserPresent);
                    await isOrderPresent.save()
                        .then(doc => {
                            if (!doc || doc.length === 0) {
                                return res.status(500).send(doc);
                            }
                            console.log(doc);
                            res.io.emit("new-complete-order", doc);
                            res.status(201).type("application/json").send(doc);
                        })
                        .catch(err => res.status(500).json(err));
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
        else if (req.body.state != false && req.body.state != true)
            return res.status(400).send("Parameter isn't correct");
        else {
            // serve validazione per Cashier
            const task = jwt.decode(req.header('auth-token')).task;
            console.log(task);
            if (task != 'cook' && task != 'barman' && task != 'waiter')
                return res.status(400).send('Missing permissions');
            const isOrderPresent = await OrdersModel.findOne({ id_order: req.params.id_order });
            if (!isOrderPresent) return res.status(400).send("Order isn't present");
            const suborders = isOrderPresent.elements_order.find(obj => obj.id_suborder == req.params.id_suborder);
            // verifica lato back end, auto
            if (task == 'cook') {
                suborders.state.foods_complete = req.body.state;
                if (req.body.state)
                    if (isOrderPresent.elements_order.every((elem) => elem.state.foods_complete))
                        isOrderPresent.state_order.all_foods_complete = true;
            }
            if (task == 'barman') {
                suborders.state.drinks_complete = req.body.state;
                if (req.body.state)
                    if (isOrderPresent.elements_order.every((elem) => elem.state.drinks_complete))
                        isOrderPresent.state_order.all_drinks_complete = true;
            }
            if (task == 'waiter') {
                if (!req.body.type)
                    return res.status(400).send('Missing parameters');
                if (req.body.type != "food" && req.body.type != "drink")
                    return res.status(400).send("Type parameter isn't correct");
                if (req.body.type == "food") {
                    suborders.state.foods_served = req.body.state;
                    isOrderPresent.tot += suborders.tot_sub_foods;
                }
                if (req.body.type == "drink") {
                    suborders.state.drinks_served = req.body.state;
                    isOrderPresent.tot += suborders.tot_sub_drinks;
                }
                if (req.body.state)
                    if (isOrderPresent.elements_order.every((elem) => elem.state.foods_served == true && elem.state.drinks_served == true))
                        isOrderPresent.state_order.all_served = true;
            }
            const name = jwt.decode(req.header('auth-token')).name;
            console.log(name);
            const isUserPresent = await UsersModel.findOne({ 'name': name });
            console.log(isUserPresent);
            if (!isUserPresent) return res.status(400).send("User isn't present");
            isUserPresent.actions += 1;
            await isUserPresent.save()
                .then(async doc => {
                    console.log("qui");
                    if (!doc || doc.length === 0) {
                        return res.status(500).send(doc);
                    }
                    console.log(doc);
                    res.io.emit("new-user-action", doc);
                    await isOrderPresent.save()
                        .then(doc => {
                            if (!doc || doc.length === 0) {
                                return res.status(500).send(doc);
                            }
                            console.log(doc);
                            res.io.emit("arrival-suborder", doc);
                            res.status(201).type("application/json").send(doc);
                        })
                        .catch(err => res.status(500).json(err));
                })
                .catch(err => res.status(500).json(err));
        }
    } catch (err) {
        console.log("qui");
        return res.status(400).send(err);
    }
});

module.exports = router;