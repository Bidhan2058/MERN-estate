const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/EstateDB")
  .then(() => {
    console.log("connecting database");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => console.log("listening"));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
