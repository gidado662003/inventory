const express = require("express");
const {
  getUsersController,
  approveUserController,
  deleteUserController,
} = require("./users.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const adminMiddleware = require("../../middleware/admin.middleware");

const usersRouter = express.Router();

usersRouter.use(authMiddleware);

// Route accessible to all authenticated users
usersRouter.get("/", getUsersController);

// Routes that require admin privileges
usersRouter.put("/:id", adminMiddleware, approveUserController);
usersRouter.delete("/:id", adminMiddleware, deleteUserController);

module.exports = usersRouter;
