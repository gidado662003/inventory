const express = require("express");
const {
  getUsersController,
  approveUserController,
  deleteUserController,
} = require("./users.controller");

const usersRouter = express.Router();

usersRouter.get("/", getUsersController);
usersRouter.put("/:id", approveUserController);
usersRouter.delete("/:id", deleteUserController);

module.exports = usersRouter;
