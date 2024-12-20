const { Sequelize } = require("sequelize");

//Sets up connection with Sequalize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, // No logging after each SQL querry
  }
);

// Test the connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL with Sequelize");
  } catch (error) {
    console.error("Unable to connect to MySQL:", error);
  }
};

module.exports = { sequelize, connectDB };
