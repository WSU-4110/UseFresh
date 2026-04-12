//import express from "express"

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const foodRoutes = require("./routes/foodRoutes");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {dbName: "usefresh"} )
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 3001;

// use auth routes
app.use("/api/user", userRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/recipes", recipeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




