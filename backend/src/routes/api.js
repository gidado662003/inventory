const express = require("express");
const productRouter = require("./products/product.route");
const salesRouter = require("./sales/sales.route");

const router = express.Router();

router.use("/products", productRouter);
router.use("/sales", salesRouter);

module.exports = router;
