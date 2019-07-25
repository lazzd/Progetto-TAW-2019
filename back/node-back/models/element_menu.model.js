let mongoose = require('mongoose');

//creazione dell'array su angular
let ElementMenuSchema = new mongoose.Schema({
    name_element_menu: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
    type: {
        type: String,
        require: true,
    },
    time: {
        type: Number,
        reqire: true,
    },
    price: {
        type: Number,
        require: true,
    },
    // quantity is necessary only for orders
    quantity: {
        type: Number,
        require: false
    }
});

module.exports = mongoose.model("ElementMenu", ElementMenuSchema);