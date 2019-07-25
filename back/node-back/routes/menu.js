var express = require('express');
var router = express.Router();

//import dishesModel
let MenuModel = require('../models/menu.model');
let elementMenuModel = require('../models/element_menu.model');

// require jsonwebtoken
let jwt = require('jsonwebtoken');

// verify function
let verifyAccessToken = require('./verifyAccessToken');

// per validazione schema
const { elementMenuValidation } = require('../validation');

router.get("/", verifyAccessToken, async function (req, res, next) {
    try {
        await MenuModel.find({})
            .then(doc => res.json(doc))
            .catch(err => res.status(500).json(err));
    } catch (err) {
        return res.status(400).send(err);
    }
});

// only users that are ... can access in the post method
router.post("/", verifyAccessToken, async function (req, res, next) {
    try {
        if (!req.body)
            return res.status(400).send('Request body is missing');
        /*else if (!req.body.name_element_menu || !req.body.category || !req.body.time || !req.body.price)
            return res.status(400).send('Missing parameters');*/
        else {
            /*
// serve validazione per ...
const task = jwt.decode(req.header('auth-token')).task;
console.log(task);
if(task != '...')
    return res.status(400).send('Missing permissions');
console.log(req.body);
*/
            const { error } = elementMenuValidation(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            if (req.body.type != "food" && req.body.type != "drink") {
                return res.status(400).send("Type of elementMenu isn't correct");
            }
            const elementMenu = new elementMenuModel(req.body);
            const isCategoryPresent = await MenuModel.findOne({ category: req.body.category });
            // la categoria é giá presente, basta pusharci dentro il nuovo Element Menu (req)
            if (isCategoryPresent) {
                // devi fare la map, verifica il predicato per ogni elemento dell'array
                console.log(isCategoryPresent.elements_category);
                // Il metodo some() verifica se almeno un elemento nell'array passa la verifica implementata dalla funzione fornita
                const isElementMenuPresent = isCategoryPresent.elements_category
                    .some((obj) => (obj.name_element_menu == req.body.name_element_menu));
                console.log("eeeee");
                if (!isElementMenuPresent) {
                    isCategoryPresent.elements_category.push(elementMenu);
                    await isCategoryPresent.save()
                        .then(doc => {
                            if (!doc || doc.length === 0) {
                                return res.status(500).send(doc);
                            }
                            console.log(doc);
                            res.status(201).type("application/json").send(doc);
                        })
                        .catch(err => res.status(500).json(err));
                }
                else {
                    // nome giá presente per quella categoria
                    console.log("qui");
                    return res.status(400).send("ElementMenu is already present in this category");
                }
            }
            else {
                // qui non é presente la category, bisogna prima crearla e poi buttare dentro il new element.
                const menu = new MenuModel({ category: req.body.category });
                console.log(elementMenu);
                menu.elements_category.push(elementMenu);
                await menu.save()
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
        // mi catcha tutto qua
        return res.status(400).send(err);
    }
});

module.exports = router;