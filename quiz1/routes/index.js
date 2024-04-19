const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken")

const authRouter = require("./auth");
const recipeRouter = require("./recipes");
const ingredientRouter=require("./ingredients");



router.use("/auth", authRouter); //authentication doesnt need jwt hence before that middleware



router.use(async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const user = jwt.verify(token.split(" ")[1], "SECRET")
        req.user = user;
        next()
    } catch (e) {
        return res.json({ msg: "TOKEN NOT FOUND / INVALID" })
    }
})

router.use("/recipes", recipeRouter);
router.use("/ingredients", ingredientRouter);

module.exports = router;