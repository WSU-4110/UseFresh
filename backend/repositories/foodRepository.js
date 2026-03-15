const FoodItem = require("../models/FoodItem");

class FoodRepository {

  async addFood(data) {
    const food = new FoodItem(data);
    return await food.save();
  }

  async getFoods() {
    return await FoodItem.find();
  }

  async deleteFood(id) {
    return await FoodItem.findByIdAndDelete(id);
  }

  async updateFood(id, data) {
    return await FoodItem.findByIdAndUpdate(id, data, { new: true });
  }

}

module.exports = new FoodRepository();