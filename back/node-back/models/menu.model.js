let mongoose =  require('mongoose');

// necessary for the right type of dishes key
let ElementMenuModel = require('../models/element_menu.model');
let ElementMenuSchema = ElementMenuModel.schema;

//creazione dell'array su angular
let MenuSchema = new mongoose.Schema ({
    category: {
        type: String,
        required: true,
    },
    elements_category: {
        type: [ElementMenuSchema],
        default: []
    }
});

module.exports = mongoose.model ("Menu", MenuSchema );