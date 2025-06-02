const express = require("express");
const salesRouter = express.Router();
const { createSale } = require("./sales.controller");

salesRouter.post("/", createSale);

module.exports = salesRouter;
