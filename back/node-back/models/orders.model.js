let mongoose = require('mongoose');

// mongoose-schema for auto-increment
const AutoIncrement = require('mongoose-sequence')(mongoose);

// necessary for the right type of ElementMenu key
let ElementOrderModel = require('../models/element_order.model');
let ElementOrderSchema = ElementOrderModel.schema;

let StateOrderModel = require('../models/state_order.model');
let StateOrderSchema = StateOrderModel.schema;

//creazione dell'array su angular
let OrdersSchema = new mongoose.Schema({
    elements_order: {
        type: [ElementOrderSchema],
        require: true
    },
    num_suborders: {
        type: Number,
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
    state_order: {
        type: StateOrderSchema,
        default: StateOrderSchema
    }
});

OrdersSchema.plugin(AutoIncrement, { inc_field: 'id_order' });

module.exports = mongoose.model("Order", OrdersSchema);