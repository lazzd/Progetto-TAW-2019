let mongoose =  require('mongoose');

// mongoose-schema for auto-increment
const AutoIncrement = require('mongoose-sequence')(mongoose);

// necessary for the right type of ElementMenu key
let ElementMenuModel = require('../models/element_menu.model');
let ElementMenuSchema = ElementMenuModel.schema;
let StateOrderModel = require('../models/state_order.model');
let StateOrderSchema = StateOrderModel.schema;

//creazione dell'array su angular
let OrdersSchema = new mongoose.Schema ({
    drinks_order: {
        type: [ElementMenuSchema],
        require: true
    },
    foods_order: {
        type: [ElementMenuSchema],
        require: true
    },
    table: {
        type: String,
        require: true
    },
    waiter: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    state: {
        type: StateOrderSchema,
        default: StateOrderSchema
    }
});

OrdersSchema.plugin(AutoIncrement, { inc_field: 'id_order' });

module.exports = mongoose.model ("Order", OrdersSchema );