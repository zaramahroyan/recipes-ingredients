const Users = require("../models/User");
const Recipes = require("../models/Recipes");
var express = require("express");
var router = express.Router();

router.post("/getRecipe", async (req, res) => {
    try {
        const recipe = await Recipes.findOne({ name: req.body.name}).populate('ingredients');
        if (!recipe) return res.json({ msg: "Recipe Not Found" })
        res.json({ msg: "Recipe Found", data: recipe })
    } catch (error) {
        console.error(error)
    }
});

router.use((req, res, next) => {
    if (!req.user.admin) return res.json({ msg: "NOT ADMIN" })
    else next()
}) //since we are using a middleware here, all further requests can only be accessed via admin


router.post("/addRecipe", async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.body.email })
       
        if (!user) return res.json({ msg: "USER NOT FOUND" })
        await Recipes.create({ ...req.body, user: user._id })
        res.json({ msg: "Recipe Added" })
    } catch (error) {
        console.error(error)
    }
});



router.post("/deleteRecipe", async (req, res) => {
    try {
        const recipe = await Recipes.findOne({ name: req.body.name })
        if (!recipe) return res.json({ msg: "RECIPE NOT FOUND" })
        await Recipes.deleteOne({ name: req.body.name})
        res.json({ msg: "RECIPE DELETED" })
    } catch (error) {
        console.error(error)
    }
});

module.exports = router
