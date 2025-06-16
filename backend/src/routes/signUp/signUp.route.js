const express = require("express");
const { signUpController, loginController } = require("./signUp.controller");

const signUpRouter = express.Router();

signUpRouter.post("/", signUpController);
signUpRouter.post("/login", loginController);

module.exports = signUpRouter;
