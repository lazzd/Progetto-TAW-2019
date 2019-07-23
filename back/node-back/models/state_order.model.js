let mongoose = require('mongoose');

//creazione dell'array su angular
let StateOrderSchema = new mongoose.Schema({
    drinks_complete: {
        type: Boolean,
        default: false
    },
    foods_complete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("StateOrder", StateOrderSchema);