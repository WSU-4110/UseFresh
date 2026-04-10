const bcrypt = require("bcrypt");

//Hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

//Compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Validate register input
const validateRegisterInput = (data) => {
  if (!data.username || !data.email || !data.password) {
    return "All fields are required";
  }
  if (data.password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
};

//Validate login input
const validateLoginInput = (data) => {
  if (!data.username && !data.email) {
    return "Username or email required";
  }
  if (!data.password) {
    return "Password required";
  }
  return null;
};

// Validate food input
const validateFoodInput = (data) => {
  if (!data.foodItem || !data.expirationDate) {
    return "Food name and expiration date required";
  }
  return null;
};

//Sanitize food input
const sanitizeFoodInput = (data) => {
  return {
    foodItem: data.foodItem.trim(),
    quantity: Number(data.quantity),
    expirationDate: data.expirationDate
  };
};

module.exports = {
  hashPassword,
  comparePassword,
  validateRegisterInput,
  validateLoginInput,
  validateFoodInput,
  sanitizeFoodInput
};
