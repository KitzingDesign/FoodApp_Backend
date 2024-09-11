const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db"); // Import MySQL connection
const corsMiddleware = require("./middlewear/corsMiddlewear");
const cookieParser = require("cookie-parser");

connectDB;

const app = express();

//middleware
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

//Built in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// Cors middleware
app.use(corsMiddleware);

//Routes
app.use("/login", require("./routes/auth"));
app.use("/register", require("./routes/register"));
app.use("/refresh", require("./routes/refresh"));

const PORT = process.env.PORT || 3500;
app.get("/test", (req, res) => {
  res.json("It works!");
});

app.listen(PORT, () => {
  console.log(`connected server is running on ${PORT}`);
});
