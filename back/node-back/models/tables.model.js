let mongoose = require('mongoose');

let TablesSchema = new mongoose.Schema({
    name_table: {
        type: String,
        required: true
    },
    seats: {
        type: Number,
        require: true
    },
    busy: {
        type: Boolean,
        default: false
    },
    waiter: {
        type: String,
        required: false
    },
    id_order: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model('Table', TablesSchema);