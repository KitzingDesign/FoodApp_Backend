const test = (req, res) => {
  res.json({
    message: "Refresh token route works",
    accessToken: req.accessToken,
  });
};

module.exports = { test };
