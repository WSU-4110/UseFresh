const express = require("express");
const router = express.Router();

const {
    addFood,
    getFood,
    deleteFood,
    updateFood
} = require("../controllers/foodController");

router.post("/add", addFood);
router.get("/all", getFoods);
router.delete("/:id", deleteFood);
router.put("/:id", updateFood);
