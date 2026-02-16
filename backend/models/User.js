const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);


/* Older Code
const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String


})

const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel
*/