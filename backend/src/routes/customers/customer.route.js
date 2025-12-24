const express = require("express");
const {
  getCustomers,
  createCustomer,
  deleteCustomer,
  payOwedGroup,
} = require("./customer.controller");
const customersRouter = express.Router();

customersRouter.get("/", getCustomers);
customersRouter.post("/", createCustomer);
customersRouter.delete("/:id", deleteCustomer);
customersRouter.post("/:id/owed-groups/:groupId/pay", payOwedGroup);
module.exports = customersRouter;
