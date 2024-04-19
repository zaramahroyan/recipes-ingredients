const mongoose=require('mongoose');

const recipeSchema=new mongoose.Schema({
name: String,
description: String,
ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredients', default: [] }]
})
const Recipes= mongoose.model('Recipes', recipeSchema);
module.exports=Recipes;