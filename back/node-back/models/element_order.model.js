let mongoose =  require('mongoose');

// mongoose-schema for auto-increment
const AutoIncrement = require('mongoose-sequence')(mongoose);

// necessary for the right type of ElementMenu key
let ElementMenuModel = require('../models/element_menu.model');
let ElementMenuSchema = ElementMenuModel.schema;
let StateElementOrderModel = require('../models/state_element_order.model');
let StateElementOrderSchema = StateElementOrderModel.schema;
let StateEmployeesElementOrderModel = require('../models/state_employees_element_order.model');
let StateEmployeesElementOrderSchema = StateEmployeesElementOrderModel.schema;

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
    employees: {
        type: StateEmployeesElementOrderSchema,
        default: StateEmployeesElementOrderSchema
    },
    tot_sub: {
        type: Number,
        default: 0
    }
});

ElementOrderSchema.plugin(AutoIncrement, { inc_field: 'id_suborder' });


module.exports = mongoose.model ("ElementOrder", ElementOrderSchema );