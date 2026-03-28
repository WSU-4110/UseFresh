/*
Test plan:

addFood test: returns 400 when food input is invalid

addFood test2: returns 201 with saved food when input is valid

getFood test: returns list of foods

deleteFood test: returns success message when message is deleted

updateFood test: returns updated food item when a valid update is made.

registerUser test: returns 400 when registration is invalid

loginUser: returns 404 when user is not found

*/

const { addFood, getFoods, deleteFood, updateFood } = require("../controllers/foodController");
const { registerUser, loginUser } = require("../controllers/userController");
const FoodItem = require("../models/FoodItem");
const User = require("../models/User");

// The real database models are replaced with Jest mocks
jest.mock("../models/FoodItem");
jest.mock("../models/User");

// This helps create fake res objects
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe("addFood", () => {

  // Test 1: Returns 400 when required fields are missing
  it("returns 400 when food input is invalid", async () => {
    const req = { body: { quantity: 2, user: "user123" } }; // missing foodItem and expirationDate
    const res = mockRes();

    await addFood(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Food name and expiration date required" });
  });

  // Test 2: Returns 201 with the saved food item when input is valid
  it("returns 201 with saved food when input is valid", async () => {
    const req = {
      body: {
        foodItem: "Apple",
        quantity: 3,
        expirationDate: "2026-12-01",
        user: "user123"
      }
    };
    const res = mockRes();

    const savedFood = { _id: "food1", foodItem: "Apple", quantity: 3, expirationDate: "2026-12-01", user: "user123" };
    FoodItem.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(savedFood)
    }));

    await addFood(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedFood);
  });

});

describe("getFoods", () => {

  // Test 3: Returns list of food items for a given user
  it("returns all food items for a user", async () => {
    const req = { query: { userId: "user123" } };
    const res = mockRes();

    const foodList = [
      { _id: "food1", foodItem: "Apple", user: "user123" },
      { _id: "food2", foodItem: "Banana", user: "user123" }
    ];
    FoodItem.find.mockResolvedValue(foodList);

    await getFoods(req, res);

    expect(FoodItem.find).toHaveBeenCalledWith({ user: "user123" });
    expect(res.json).toHaveBeenCalledWith(foodList);
  });

});

describe("deleteFood", () => {

  // Test 4: Returns success message when a food item is deleted
  it("returns success message when food item is deleted", async () => {
    const req = { params: { id: "food1" }, query: { userId: "user123" } };
    const res = mockRes();

    FoodItem.findByIdAndDelete.mockResolvedValue({});

    await deleteFood(req, res);

    expect(FoodItem.findByIdAndDelete).toHaveBeenCalledWith({ _id: "food1", user: "user123" });
    expect(res.json).toHaveBeenCalledWith({ message: "Food item deleted" });
  });

});

describe("updateFood", () => {

  // Test 5: Returns the updated food item when a valid update is made
  it("returns updated food item on successful update", async () => {
    const req = {
      params: { id: "food1" },
      body: { foodItem: "Green Apple", quantity: 5, user: "user123" }
    };
    const res = mockRes();

    const updatedFood = { _id: "food1", foodItem: "Green Apple", quantity: 5, user: "user123" };
    FoodItem.findByIdAndUpdate.mockResolvedValue(updatedFood);

    await updateFood(req, res);

    expect(res.json).toHaveBeenCalledWith(updatedFood);
  });

});


describe("registerUser", () => {

  // Test 6: Returns 400 when registration input is invalid (missing fields)
  it("returns 400 when registration input is invalid", async () => {
    const req = { body: { username: "sanika" } }; // missing email and password
    const res = mockRes();

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "All fields are required" });
  });

});

describe("loginUser", () => {

  // Test 7: Returns 404 when no user is found with the given credentials
  it("returns 404 when user is not found", async () => {
    const req = { body: { email: "notreal@test.com", password: "password123" } };
    const res = mockRes();

    User.findOne.mockResolvedValue(null); // simulates no user found in DB

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "No user found" });
  });

});
