//import express from "express"

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {dbName: "usefresh"} )
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 3001;

// use auth routes
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




/* 
OLDER CODE

------

const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const UserModel = require("./models/User")
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 3001;


app.post("/login", (req, res) => {

    const {email, password} = req.body;
    UserModel.findOne({email: email})
    .then(user => {
        if(user) { //checks if user exists
            if(user.password === password){ //checks if password matches
                res.json("Success")


            } else {//if password does not match
                res.json("The password is incorrect")

            }


        }
        else {
            res.json("No record existed")


         }


        })


})

app.post('/register', (req, res) => {
    UserModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))

} )

app.listen(PORT, () =>{

    console.log("Server is running");
});

------
*/