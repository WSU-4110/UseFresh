const FoodItem = require(".../models/FoodItem");

//This is teh logic that adds the food items to teh database
exports.addFood = async (req, res) => {
  try {
    const newFood = new FoodItem({
      foodItem: req.body.foodItem,
      quantity: req.body.quantity,
      expirationDate: req.body.expirationDate
    });

    const savedFood = await newFood.save();
    res.status(201).json(savedFood);

  } catch (error) {
    res.status(500).json({ error: "Unable to add food item" });
  }
};