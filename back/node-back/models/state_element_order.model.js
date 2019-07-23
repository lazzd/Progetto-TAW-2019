let mongoose = require('mongoose');

//creazione dell'array su angular
let StateElementOrderSchema = new mongoose.Schema({
    drinks_complete: {
        type: Boolean,
        default: false
    },
    foods_complete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("StateElementOrder", StateElementOrderSchema);