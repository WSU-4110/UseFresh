const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        category: String,
        quantity: Number,
        expirationDate: Date,
        storageLocation: String
    }
);

module.exports = mongoose.model("FoodItem", foodSchema);