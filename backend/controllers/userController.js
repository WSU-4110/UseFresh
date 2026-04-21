const User = require('../models/User');
const { hashPassword, comparePassword, validateRegisterInput, validateLoginInput } = require("../utils/authUtils");
const crypto = require('crypto');
const nodemailer = require('nodemailer');



const registerUser = async (req, res) => {
  try {
    const error = validateRegisterInput(req.body);
    if (error) return res.status(400).json({ error });

    const hashedPassword = await hashPassword(req.body.password);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword
    });

    const { _id, username, email } = newUser;
    res.status(201).json({ _id, username, email });

  } catch (err) {
    // Handle duplicate key (unique) errors from Mongo/Mongoose
    if (err && err.code === 11000) {
      const field = Object.keys(err.keyValue || {})[0] || 'value';
      return res.status(409).json({ error: `${field} already in use` });
    }

    res.status(400).json({ error: err.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const error = validateLoginInput(req.body);
    if (error) return res.status(400).json({ error });

    const { username, email, password } = req.body;

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.json({
      message: "Success",
      user: { _id: user._id, username: user.username, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* CODE W/OUT HASHING
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
*/


// POST /api/user/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether email exists — always return same response
      return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
    }

    // Generate a random token and set 1-hour expiry
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Send the email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const resetLink = `http://localhost:5173/reset_password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'UseFresh - Password Reset',
      html: `<p>Click the link below to reset your password. This link expires in 1 hour.</p>
             <a href="${resetLink}">${resetLink}</a>`
    });

    return res.status(200).json({ message: "If that email exists, a reset link has been sent." });

  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// POST /api/user/reset-password/:token
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }  // token must not be expired
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Hash the new password and clear the token
    const { hashPassword } = require('../utils/authUtils');
    user.password = await hashPassword(password);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });

  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };

