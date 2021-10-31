const Ingredient = require('../model/ingredient');

/**
 * Fetchs all the ingredients in the database then returns it
 * @param request
 * @param response
 * @return {Promise<void>}
 */
async function index (request, response) {
  return response.json({
    ingredients: await Ingredient.find({}).sort({name: 1}),
  });
}

async function create(request, response) {
  const {name, carbsPerHundred, defaultPortionWeight} = request.body;
  const newIngredient = await Ingredient.create({
    name,
    carbsPerHundred: parseInt(carbsPerHundred),
    defaultPortionWeight
  })

  return response.json({
    newIngredient,
  })
}

async function deleteIngredient(request, response) {
  await Ingredient.findByIdAndDelete(request.params._id);
  return response.json({message: "ok"})
}

module.exports.index = index;
module.exports.create = create;
module.exports.delete = deleteIngredient;
