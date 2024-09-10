const { Sequelize } = require("sequelize");
const mysql = require("mysql2");

//Sets up connection with Sequalize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // No logging after each SQL querry
  }
);

//Tests connection to DB
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("DATABASE CONNECTED");
  } catch (err) {
    console.error("DATABASE CONNECTION ERROR:", err);
  }
};

testConnection();

module.exports = sequelize;
