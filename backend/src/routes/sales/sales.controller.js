const Sale = require("../../models/sales.mongo");
const Product = require("../../models/products.mongo");

async function createSale(req, res) {
  try {
    const { items } = req.body;

    const saleItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product with ID ${item.product} not found`);
        }

        return {
          product: product._id,
          name: product.name,
          salePrice: item.salePrice || product.price,
          quantity: item.quantity,
        };
      })
    );

    const totalAmount = saleItems.reduce(
      (sum, item) => sum + item.salePrice * item.quantity,
      0
    );

    const sale = await Sale.create({
      items: saleItems,
      totalAmount,
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createSale,
};
