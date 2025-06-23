const express = require("express");
const {
  getUsersController,
  approveUserController,
  deleteUserController,
} = require("./users.controller");
const authMiddleware = require("../../middleware/auth.middleware");

const usersRouter = express.Router();

usersRouter.use(authMiddleware);

usersRouter.get("/", getUsersController);
usersRouter.put("/:id", approveUserController);
usersRouter.delete("/:id", deleteUserController);

module.exports = usersRouter;
