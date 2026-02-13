//import express from "express"

const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{

    console.log("Server is running");
});
