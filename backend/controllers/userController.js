const User = require('../models/User');

// REGISTER
const registerUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    // Send back only safe info (no password)
    const { _id, username, email } = newUser;
    res.status(201).json({ _id, username, email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // find user by email or username
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // send safe info
    res.json({ message: "Success", user: { _id: user._id, username: user.username, email: user.email } });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerUser, loginUser };