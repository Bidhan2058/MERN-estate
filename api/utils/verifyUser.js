const errorHandler = require("./error");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const token = cookies
    .split(";")
    .find((cookie) => cookie.trim().startsWith("access_token="))
    .split("=")[1];

  if (!token) return;
  next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));

    req.user = user;
    next();
  });
};
module.exports = verifyToken;
