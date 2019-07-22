let mongoose =  require('mongoose');
// mongoose-schema for auto-increment
const AutoIncrement = require('mongoose-sequence')(mongoose);

// necessary for the right type of dishes key
let DishesModel = require('../models/dishes.model');
let DishesSchema = DishesModel.schema;

//creazione dell'array su angular
let OrdersSchema = new mongoose.Schema ({
    dishes: {
        type: [DishesSchema],
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

OrdersSchema.plugin(AutoIncrement, { inc_field: 'id_order' });
module.exports = mongoose.model ("Order", OrdersSchema );