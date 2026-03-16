//moved logic from Scanserver here:


import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  foodItem: String,
  quantity: Number,
  expirationDate: Date
});

const Food = mongoose.model("Food", foodSchema,"fooditems");

export default Food;