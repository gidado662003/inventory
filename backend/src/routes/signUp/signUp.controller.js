const User = require("../../models/users.mongo");
const bcrypt = require("bcrypt");

const signUpController = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  const existingUser = await User.findOne({ username: username });
  if (existingUser) {
    return res.status(409).json({ message: "Username already taken" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.status(200).json({ success: true, message: "Sign up successful" });
};

const loginController = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const userWithoutPassword = {
    id: user._id,
    username: user.username,
    role: user.role || "user",
  };

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: userWithoutPassword,
  });
};

module.exports = { signUpController, loginController };
