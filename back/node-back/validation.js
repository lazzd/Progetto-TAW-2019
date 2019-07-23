// VALIDATION, validete the response form a right user
const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = function (data) {
    const UsersSchema = {
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        task: Joi.string().min(6).required(),
    }
    return Joi.validate(data, UsersSchema);
}

const loginValidation = function (data) {
    const LoginSchema = {
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    }
    return Joi.validate(data, LoginSchema);
}

const tableValidation = function (data) {
    const TablesSchema = {
        name_table: Joi.string().min(1).required(),
        seats: Joi.number().min(1).required(),
    }
    return Joi.validate(data, TablesSchema);
}

const elementMenuValidation = function (data) {
    const ElementMenuValidation = {
        name_element_menu: Joi.string().required(),
        category: Joi.string().required(),
        time: Joi.number().required(),
        price: Joi.number().required()
    }
    return Joi.validate(data, ElementMenuValidation);
}

// Posso fare il validate anche di menu POST

// -----------------------------------------

const ElementMenuNestedSchema = {
    _id: Joi.string(),
    name_element_menu: Joi.string().required(),
    category: Joi.string().required(),
    time: Joi.number().required(),
    price: Joi.number().required()
};

const orderValidation =  function(data) {
    const OrderValidation = {
        drinks_order: Joi.array().items(Joi.object(ElementMenuNestedSchema)),
        foods_order: Joi.array().items(Joi.object(ElementMenuNestedSchema)),
        table: Joi.string().required(),
        waiter: Joi.string().required()
    }
    return Joi.validate(data, OrderValidation);

}

const elementOrderValidation = function (data) {
    const ElementOrderValidation = {
        drinks_order: Joi.array().items(Joi.object(ElementMenuNestedSchema)),
        foods_order: Joi.array().items(Joi.object(ElementMenuNestedSchema))
    }
    return Joi.validate(data, ElementOrderValidation);
}

// -----------------------------------------

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.tableValidation = tableValidation;
module.exports.elementMenuValidation = elementMenuValidation;
module.exports.orderValidation = orderValidation;
module.exports.elementOrderValidation = elementOrderValidation;