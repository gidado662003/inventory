const Sale = require("../../models/sales.mongo");
const Product = require("../../models/products.mongo");

async function createSale(req, res) {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items array is required" });
    }

    // 1. Check for stock availability
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product}` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Only ${product.quantity} left.`,
        });
      }
    }

    // 2. Save the sale
    const sale = new Sale({ items });
    await sale.save();

    // 3. Update stock quantities
    for (const item of sale.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );
    }

    res.status(201).json(sale);
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: error.message });
  }
}

async function getSales(req, res) {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const sales = await Sale.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
    res.status(200).json(sales);
  } catch (error) {}
}

async function getReport(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const sales = await Sale.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    res.status(200).json(sales);
  } catch (error) {}
}

module.exports = {
  createSale,
  getSales,
  getReport,
};
