var express = require('express');
var router = express.Router();

//import dishesModel
let ElementOrderModel = require('../models/element_order.model');
let MenuModel = require('../models/menu.model');
let OrdersModel = require('../models/orders.model');
let TablesModel = require('../models/tables.model');

// require jsonwebtoken
let jwt = require('jsonwebtoken');

// verify function
let verifyAccessToken = require('./verifyAccessToken');

// per validazione schema
const { orderValidation, elementOrderValidation } = require('../validation');

async function isElementMenuPresent(elem) {
    try {
        await MenuModel.findOne({ category: elem.category })
            .then(category => {
                if (!category)
                    return false;
                let res = category.elements_category.some(ElementMenu => ElementMenu.name_element_menu == elem.name_element_menu);
                return (res) ? true : false;
            })
            .catch(err => {
                console.log(err);
                return false;
            });
    } catch (err) {
        return false;
    }
}


router.get("/", verifyAccessToken, async function (req, res, next) {
    try {
        const task = jwt.decode(req.header('auth-token')).task;
        if (task == 'cook') {
            await OrdersModel.find({ 'state_order.all_foods_complete': false })
                .then(array => {
                    for (let i = 0; i < array.length; ++i) {
                        array[i].elements_order = array[i].elements_order.filter(sub_order => sub_order.employees.foods_employee == null);
                    }
                    res.json(array)
                })
                .catch(err => res.status(500).json(err));
        }
        else if (task == 'barman') {
            await OrdersModel.find({ 'state_order.all_drinks_complete': false })
                .then(array => {
                    for (let i = 0; i < array.length; ++i) {
                        array[i].elements_order = array[i].elements_order.filter(sub_order => sub_order.employees.drinks_employee == null);
                    }
                    res.json(array)
                })
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


// VEDERE SE L'ENDPOINT PUO' ANDARE BENE
router.get("/myOrders", verifyAccessToken, async function (req, res, next) {
    try {
        const task = jwt.decode(req.header('auth-token')).task;
        if (task == 'cook') {
            const name = jwt.decode(req.header('auth-token')).name;
            await OrdersModel.find({ 'state_order.all_foods_complete': false })
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
            await OrdersModel.find({ 'state_order.all_drinks_complete': false })
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
            await OrdersModel.find({ waiter: name, 'state_order.complete': false })
                .then(array => {
                    //console.log(array);
                    for (let i = 0; i < array.length; ++i) {
                        array[i].elements_order = array[i].elements_order.filter(sub_order => (sub_order.state.drinks_served == false || sub_order.state.foods_served == false) && (sub_order.state.drinks_complete == true || sub_order.state.foods_complete == true));
                        for (let u = 0; u < array[i].elements_order.length; ++u) {
                            if (array[i].elements_order[u].state.drinks_served || !array[i].elements_order[u].state.drinks_complete)
                                array[i].elements_order[u].drinks_order = [];
                            if (array[i].elements_order[u].state.foods_served || !array[i].elements_order[u].state.foods_complete)
                                array[i].elements_order[u].foods_order = [];
                        }
                    }
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

// OK
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

// OK
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
                        // ACCOLLA
                        return res.status(500).send(doc);
                    }
                    res.io.emit("take-suborder", "A user take the first suborder");
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
    /*
      ASSOLUTMANETE: alla creazione dell'ordine buttare dentro l'id sul tavolo con find...
    */
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
                // vedere se ti butta giá dentro il table ed il waiter presenti nel body;
                let model_element_order = new ElementOrderModel(req.body);
                if (!req.body.drinks_order)
                    model_element_order.state.drinks_complete = true;
                if (!req.body.foods_order)
                    model_element_order.state.foods_complete = true;
                let model = new OrdersModel(req.body);
                // first order with this id_order
                model.num_suborders = 1;
                //model_element_order.id_suborder = model.num_suborders;
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
            // problema nella validazione
            if (error) return res.status(400).send(error.details[0].message);
            if (!req.body.drinks_order && !req.body.foods_order) {
                return res.status(400).send("No Order Request");
            }
            else {
                /*
        // serve validazione per Waiter
        const task = jwt.decode(req.header('auth-token')).task;
        //console.log(task);
        if (task == 'waiter')
          isOrderPresent.state.complete = req.body.state;
        else
          return res.status(400).send('Missing permissions');
        */
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
                if (!req.body.drinks_order)
                    model_element_order.state.drinks_complete = true;
                if (!req.body.foods_order)
                    model_element_order.state.foods_complete = true;
                //isOrderPresent.num_suborders += 1;
                model_element_order.id_suborder = isOrderPresent.num_suborders;
                isOrderPresent.elements_order.push(model_element_order);
                if (isOrderPresent.state_order.all_served)
                    isOrderPresent.state_order.all_served = false;
                if (isOrderPresent.state_order.all_drinks_complete)
                    isOrderPresent.state_order.all_drinks_complete = false;
                if (isOrderPresent.state_order.all_foods_complete)
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

// OK
router.put("/:id_order/complete", verifyAccessToken, async function (req, res, next) {
    try {
        if (isNaN(req.params.id_order))
            return res.status(400).send("Id_order isn't a number");
        if (!req.body)
            return res.status(400).send('Request body is missing');
        else if (!req.body.state)
            return res.status(400).send('Missing parameters');
        else if (req.body.state != false && req.body.state != true)
            // verifica se così o a stringa
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
                //if (!isOrderPresent.elements_order.every((elem) => elem.state.foods_complete) || !isOrderPresent.elements_order.every((elem) => elem.state.drinks_complete))
                if (!isOrderPresent.state_order.all_served)
                    return res.status(400).send("Some Suborder isn't serve");
                isOrderPresent.state_order.complete = req.body.state;
            }
            else {
                isOrderPresent.state_order.complete = req.body.state;
            }
            // DOVREBBE ANDARE TUTTO IN AUTOMATICO, IMPLEMENTA L'EVERY
            /*if (task == 'barman')
                isOrderPresent.state_order.all_drinks_complete = req.body.state;
            if (task == 'cook')
                isOrderPresent.state_order.all_foods_complete = req.body.state;*/
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
        else if (req.body.state != false && req.body.state != true)
            // verifica se così o a stringa
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
                if (req.body.type == "food")
                    suborders.state.foods_served = req.body.state;
                if (req.body.type == "drink")
                    suborders.state.drinks_served = req.body.state;
                if (req.body.state)
                    if (isOrderPresent.elements_order.every((elem) => elem.state.foods_served == true && elem.state.drinks_served == true))
                        isOrderPresent.state_order.all_served = true;
            }
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
        }
    } catch (err) {
        return res.status(400).send(err);
    }
});

// da aggiungere i PUT state per i barman, e cuochi e il cassiere per la terminazione in complete

module.exports = router;