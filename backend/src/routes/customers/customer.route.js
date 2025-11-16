const express = require("express");
const {
  getCustomers,
  createCustomer,
  deleteCustomer,
} = require("./customer.controller");
const customersRouter = express.Router();

customersRouter.get("/", getCustomers);
customersRouter.post("/", createCustomer);
customersRouter.delete("/:id", deleteCustomer);
module.exports = customersRouter;
