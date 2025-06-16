const User = require("../../models/users.mongo");

const getUsersController = async (req, res) => {
  const users = await User.find();
  res.status(200).json({ users });
};

const approveUserController = async (req, res) => {
  const { id } = req.params;
  const { approved } = req.body;
  const user = await User.findByIdAndUpdate(id, { approved }, { new: true });
  res.status(200).json({ user });
};

const deleteUserController = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.status(200).json({ message: "User deleted successfully" });
};

module.exports = {
  getUsersController,
  approveUserController,
  deleteUserController,
};
