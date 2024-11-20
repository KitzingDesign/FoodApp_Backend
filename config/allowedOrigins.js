const allowedOrigins = [
  "https://www.matmatmaten.com",
  "https://www.api.matmatmaten.com",
  "https://cook-book-app-seven.vercel.app",
];

// Conditionally include localhost for development
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:5173");
  allowedOrigins.push("http://192.168.0.185:5173"); // Development origin
}

module.exports = allowedOrigins;
