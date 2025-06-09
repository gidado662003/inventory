const express = require("express");
const salesRouter = express.Router();
const { createSale, getSales, getReport } = require("./sales.controller");

salesRouter.post("/", createSale);
salesRouter.get("/", getSales);
salesRouter.get("/report", getReport);

module.exports = salesRouter;
