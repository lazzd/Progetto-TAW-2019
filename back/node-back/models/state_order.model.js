let mongoose = require('mongoose');

//creazione dell'array su angular
let StateOrderSchema = new mongoose.Schema({
    complete: {
        type: Boolean,
        default: false
    },
    all_served: {
        type: Boolean,
        default: false
    },
    all_drinks_complete: {
        type: Boolean,
        default: false
    },
    all_foods_complete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("StateOrder", StateOrderSchema);