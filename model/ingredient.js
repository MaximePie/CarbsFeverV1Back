const mongoose = require('mongoose');
const {Schema} = mongoose;

const ingredientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 255,
  },
  carbsPerHundred: {
    type: Number,
    required: true,
  },
  defaultPortionWeight: {
    type: Number,
    required: true,
  },
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = Ingredient;
