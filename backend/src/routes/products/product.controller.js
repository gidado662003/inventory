const Product = require("../../models/products.mongo");

async function createProduct(req, res) {
  try {
    const { name, quantity, salePrice } = req.body;
    if (!name || !quantity || !salePrice) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }
    const product = await Product.create({ name, quantity, salePrice });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getProducts(req, res) {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, quantity, salePrice } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { name, quantity, salePrice },
      { new: true }
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createProduct,
  getProducts,
  deleteProduct,
  getProductById,
  updateProduct,
};
