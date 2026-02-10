console.log("Node is running this file");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
