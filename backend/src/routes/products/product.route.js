const express = require("express");
const productRouter = express.Router();
const {
  createProduct,
  getProducts,
  deleteProduct,
  getProductById,
  updateProduct,
} = require("./product.controller");
const authMiddleware = require("../../middleware/auth.middleware");

productRouter.use(authMiddleware);

productRouter.post("/", createProduct);
productRouter.get("/", getProducts);
productRouter.delete("/:id", deleteProduct);
productRouter.get("/:id", getProductById);
productRouter.put("/:id", updateProduct);

module.exports = productRouter;
