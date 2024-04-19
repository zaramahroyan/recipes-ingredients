const Users = require("../models/User");
const Ingredients = require("../models/Ingredients");
var express = require("express");
var router = express.Router();



router.use((req, res, next) => {
    if (!req.user.admin) return res.json({ msg: "NOT ADMIN" })
    else next()
}) //since we are using a middleware here, all further requests can only be accessed via admin



router.post("/addIngredients", async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.body.email })
        if (!user) return res.json({ msg: "USER NOT FOUND" })
        await Ingredients.create({ ...req.body, user: user._id })
        res.json({ msg: "Ingredient Added" })
    } catch (error) {
        console.error(error)
    }
}); 


router.post("/deleteByName", async (req, res) => {
    try {
        const ingredient = await Ingredients.findOne({ name: req.body.name });
        if (!ingredient) return res.json({ msg: "INGREDIENT NOT FOUND" });
        await Ingredients.deleteOne({ name: req.body.name });
        res.json({ msg: "INGREDIENT DELETED" });
    } catch (error) {
        console.error(error);
        res.json({ msg: "Error deleting ingredient" });
    }
});

module.exports = router
