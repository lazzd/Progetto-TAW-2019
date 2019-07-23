let mongoose =  require('mongoose');

// necessary for the right type of ElementMenu key
let ElementMenuModel = require('../models/element_menu.model');
let ElementMenuSchema = ElementMenuModel.schema;
let StateOrderModel = require('../models/state_order.model');
let StateOrderSchema = StateOrderModel.schema;

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
        type: StateOrderSchema,
        default: StateOrderSchema
    },
    id_suborder: {
        type:  Number,
        require: true
    }
});

module.exports = mongoose.model ("ElementOrder", ElementOrderSchema );