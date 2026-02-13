//import express from "express"

const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://sannadate2023_db_user:ynezhdhe9H732Pnq@cluster0.159japd.mongodb.net/?appName=Cluster0/employee")

app.listen(3001, () =>{

    console.log("Server is running");
});
