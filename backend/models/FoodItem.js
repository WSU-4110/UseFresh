const mongoose = require("mongoose");


const foodSchema = new mongoose.Schema(
    {
        foodItem: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            default: 1

        },
        expirationDate: {
            type: Date,
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
        
    }
);

module.exports = mongoose.model("FoodItem", foodSchema);