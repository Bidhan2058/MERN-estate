const User = require("../Model/user.model");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(200).send("user createed");
  } catch (err) {
    res.status(500).json(err.message);
  }
};
module.exports = signup;
