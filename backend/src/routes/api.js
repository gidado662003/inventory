const express = require("express");
const productRouter = require("./products/product.route");
const salesRouter = require("./sales/sales.route");
const signUpRouter = require("./signUp/signUp.route");
const usersRouter = require("./users/users.route");
const customersRouter = require("./customers/customer.route");

const router = express.Router();

router.use("/products", productRouter);
router.use("/sales", salesRouter);
router.use("/", signUpRouter);
router.use("/users", usersRouter);
router.use("/customers", customersRouter);

module.exports = router;
