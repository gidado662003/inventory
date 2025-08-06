const express = require("express");
const { getCustomers, createCustomer } = require("./customer.controller");
const customersRouter = express.Router();

customersRouter.get("/", getCustomers);
customersRouter.post("/", createCustomer);

module.exports = customersRouter;