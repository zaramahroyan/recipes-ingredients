const mongoose=require('mongoose');

const ingredientSchema=new mongoose.Schema({
name: String,
description: String
})
const Ingredients= mongoose.model('Ingredients', ingredientSchema);
module.exports=Ingredients;