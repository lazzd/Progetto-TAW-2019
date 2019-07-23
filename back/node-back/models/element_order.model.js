let mongoose =  require('mongoose');

// necessary for the right type of ElementMenu key
let ElementMenuModel = require('../models/element_menu.model');
let ElementMenuSchema = ElementMenuModel.schema;
let StateElementOrderModel = require('../models/state_element_order.model');
let StateElementOrderSchema = StateElementOrderModel.schema;

//creazione dell'array su angular
let ElementOrderSchema = new mongoose.Schema ({
    drinks_order: {
        type: [ElementMenuSchema],
        require: false
    },
    foods_order: {
        type: [ElementMenuSchema],
        require: false
    },
    state: {
        type: StateElementOrderSchema,
        default: StateElementOrderSchema
    },
    id_suborder: {
        type:  Number,
        require: true
    }
});

module.exports = mongoose.model ("ElementOrder", ElementOrderSchema );