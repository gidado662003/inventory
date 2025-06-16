const express = require("express");
const { signUpController, loginController, logoutController } = require("./signUp.controller");

const signUpRouter = express.Router();

signUpRouter.post("/signUp", signUpController);
signUpRouter.post("/login", loginController);
signUpRouter.post("/logout", logoutController);

module.exports = signUpRouter;
