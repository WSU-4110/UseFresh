//import express from "express"

const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const EmployeeModel = require("./models/Employee")
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
    EmployeeModel.findOne({email: email})
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
    EmployeeModel.create(req.body)
    .then(employees => res.json(employees))
    .catch(err => res.json(err))

} )

app.listen(PORT, () =>{

    console.log("Server is running");
});
