let mongoose = require('mongoose');

let UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        require: true,
        min: 6,
        max: 255 // max numbers of characters
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024 // for hashing password
    },
    date: {
        type: Date,
        default: Date.now
    },
    task: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('User', UsersSchema);