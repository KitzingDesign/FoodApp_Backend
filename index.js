const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db"); // Import MySQL connection

connectDB;

const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());

//Routes
app.use("/register", require("./routes/register"));

app.get("/test", (req, res) => {
  res.json("It works!");
});

app.listen(PORT, () => {
  console.log(`connected server is running on ${PORT}`);
});
