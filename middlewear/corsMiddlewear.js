const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
