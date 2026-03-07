const FoodItem = require("../models/FoodItem");

//This is the logic that adds the food items to teh database
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

exports.getFoods = async (req, res) => {
  try {
    const foods = await FoodItem.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch food items" });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    await FoodItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Food item deleted" });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete food item" });
  }
};

exports.updateFood = async (req, res) => {
  try {
    const updatedFood = await FoodItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedFood);

  } catch (error) {
    res.status(500).json({ error: "Unable to update food item" });
  }
};
