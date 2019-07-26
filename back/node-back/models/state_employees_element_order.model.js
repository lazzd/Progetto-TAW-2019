let mongoose = require('mongoose');

//creazione dell'array su angular
let StateEmployeesElementOrderSchema = new mongoose.Schema({
    drinks_employee: {
        type: String,
        default: null
    },
    foods_employee: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model("StateEmployeesElementOrder", StateEmployeesElementOrderSchema);