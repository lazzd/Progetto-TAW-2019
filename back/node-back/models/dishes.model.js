let mongoose = require('mongoose');
// mongoose-schema for auto-increment
const AutoIncrement = require('mongoose-sequence')(mongoose);

let DishesSchema = new mongoose.Schema({
    name_dish: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        require: true
    },
    category: {
        type: String,
        require: true
    }
});

DishesSchema.plugin(AutoIncrement, { inc_field: 'id_dish' });

module.exports = mongoose.model('Dish', DishesSchema);