
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ViewItemsPage from "./ViewItems";
import axios from "axios";

jest.mock("axios");

beforeEach(() => {
  jest.clearAllMocks();
  window.alert = jest.fn();
});

test("loads food items from API on page load", async () => {
  axios.get.mockResolvedValueOnce({
    data: [
      {
        _id: "1",
        foodItem: "Milk",
        quantity: 2,
        expirationDate: "2026-04-05",
      },
    ],
  });

  render(<ViewItemsPage />);

  expect(await screen.findByText("Milk")).toBeInTheDocument();
});

test("does not add item when required fields are missing", async () => {
  axios.get.mockResolvedValueOnce({ data: [] });

  render(<ViewItemsPage />);

  fireEvent.click(screen.getByText("Add Food Item"));
  fireEvent.click(screen.getByText("Save food item"));

  expect(window.alert).toHaveBeenCalledWith("Please fill in the required fields!");
});

test("adds a food item successfully", async () => {
  axios.get.mockResolvedValueOnce({ data: [] });
  axios.post.mockResolvedValueOnce({
    data: {
      _id: "2",
      foodItem: "Eggs",
      quantity: 12,
      expirationDate: "2026-04-10",
    },
  });

  render(<ViewItemsPage />);

  fireEvent.click(screen.getByText("Add Food Item"));

  fireEvent.change(screen.getByPlaceholderText("Enter food name"), {
    target: { value: "Eggs" },
  });

  fireEvent.change(screen.getByPlaceholderText("Enter food quantity"), {
    target: { value: "12" },
  });

  const dateInputs = screen.getAllByDisplayValue("");
  fireEvent.change(dateInputs[0], {
    target: { value: "2026-04-10" },
  });

  fireEvent.click(screen.getByText("Save food item"));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalled();
  });
});

test("shows alert when removing a food item that does not exist", async () => {
  axios.get.mockResolvedValueOnce({ data: [] });

  render(<ViewItemsPage />);

  fireEvent.click(screen.getByText("Remove Food Item"));

  fireEvent.change(screen.getByPlaceholderText("Enter food name"), {
    target: { value: "Bread" },
  });

  fireEvent.click(screen.getByText("Remove food item"));

  expect(window.alert).toHaveBeenCalledWith("Food item not found.");
});

test("removes a food item successfully", async () => {
  axios.get.mockResolvedValueOnce({
    data: [
      {
        _id: "3",
        foodItem: "Bread",
        quantity: 1,
        expirationDate: "2026-04-15",
      },
    ],
  });

  axios.delete.mockResolvedValueOnce({});

  render(<ViewItemsPage />);

  expect(await screen.findByText("Bread")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Remove Food Item"));

  fireEvent.change(screen.getByPlaceholderText("Enter food name"), {
    target: { value: "Bread" },
  });

  fireEvent.click(screen.getByText("Remove food item"));

  await waitFor(() => {
    expect(axios.delete).toHaveBeenCalled();
  });
});

test("shows alert when editing with missing fields", async () => {
  axios.get.mockResolvedValueOnce({ data: [] });

  render(<ViewItemsPage />);

  fireEvent.click(screen.getByText("Edit Food Item"));
  fireEvent.click(screen.getByText("Update food item"));

  expect(window.alert).toHaveBeenCalledWith(
    "Please enter food name, quantity, and expiration date."
  );
});

test("edits a food item successfully", async () => {
  axios.get.mockResolvedValueOnce({
    data: [
      {
        _id: "4",
        foodItem: "Cheese",
        quantity: 1,
        expirationDate: "2026-04-20",
      },
    ],
  });

  axios.put.mockResolvedValueOnce({
    data: {
      _id: "4",
      foodItem: "Cheese",
      quantity: 3,
      expirationDate: "2026-04-25",
    },
  });

  render(<ViewItemsPage />);

  expect(await screen.findByText("Cheese")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Edit Food Item"));

  fireEvent.change(screen.getByPlaceholderText("Enter food name"), {
    target: { value: "Cheese" },
  });

  fireEvent.change(screen.getByPlaceholderText("Enter new quantity"), {
    target: { value: "3" },
  });

  const dateInputs = screen.getAllByDisplayValue("");
  fireEvent.change(dateInputs[0], {
    target: { value: "2026-04-25" },
  });

  fireEvent.click(screen.getByText("Update food item"));

  await waitFor(() => {
    expect(axios.put).toHaveBeenCalled();
  });
});