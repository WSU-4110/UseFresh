const {
  hashPassword,
  comparePassword,
  validateRegisterInput,
  validateLoginInput,
  validateFoodInput,
  sanitizeFoodInput
} = require("./authUtils");

describe("Auth Utils Tests", () => {

  // hashPasswordd
  test("should hash password and not equal original", async () => {
    const password = "password123";
    const hashed = await hashPassword(password);

    expect(hashed).not.toBe(password);
    expect(typeof hashed).toBe("string");
  });

  // comparePassword (true)
  test("should return true for correct password", async () => {
    const password = "password123";
    const hashed = await hashPassword(password);

    const result = await comparePassword(password, hashed);
    expect(result).toBe(true);
  });

  // 3. comparePassword (false)
  test("should return false for incorrect password", async () => {
    const password = "password123";
    const wrong = "wrong123";
    const hashed = await hashPassword(password);

    const result = await comparePassword(wrong, hashed);
    expect(result).toBe(false);
  });

  // validateRegisterInput
  test("should fail if missing fields", () => {
    const result = validateRegisterInput({
      username: "",
      email: "",
      password: ""
    });

    expect(result).toBe("All fields are required");
  });

  //validateLoginInput
  test("should require password", () => {
    const result = validateLoginInput({
      username: "user"
    });

    expect(result).toBe("Password required");
  });

  // 6. validateFoodInput
  test("should require food item and expiration date", () => {
    const result = validateFoodInput({
      foodItem: "",
      expirationDate: ""
    });

    expect(result).toBe("Food name and expiration date required");
  });

  // sanitizeFoodInput -- which basically means
  //removing extra space, etc.
  test("should sanitize and convert quantity", () => {
    const input = {
      foodItem: " apple ",
      quantity: "5",
      expirationDate: "2025-01-01"
    };

    const result = sanitizeFoodInput(input);

    expect(result.foodItem).toBe("apple");
    expect(result.quantity).toBe(5);
  });

});