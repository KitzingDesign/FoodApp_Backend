const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,POST,PUT,DELETE,PATCH, OPTION", // Add other HTTP methods if needed
  allowedHeaders: ["Content-Type", "Authorization"], // Add any other headers you're using
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
