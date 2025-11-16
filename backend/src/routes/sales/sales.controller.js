const Sale = require("../../models/sales.mongo");
const Product = require("../../models/products.mongo");
const Customer = require("../../models/customer.mongo");

async function createSale(req, res) {
  try {
    const { items, customerName, amountPaid } = req.body;
    console.log(items);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items array is required" });
    }

    // Check if any item has paymentType "Partial" and requires customerName
    const hasPartialPayment = items.some(
      (item) => item.paymentType === "Outstanding"
    );

    if (hasPartialPayment) {
      if (!customerName || customerName.trim() === "") {
        return res
          .status(400)
          .json({ message: "Customer is required for partial payments" });
      }

      // Validate that the customer exists
      const customer = await Customer.findById(customerName);
      if (!customer) {
        return res.status(404).json({ message: "Selected customer not found" });
      }
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

    // 2. Save the sale with customerName and amountPaid if provided
    const saleData = { items };
    if (hasPartialPayment && customerName) {
      saleData.customerName = customerName;
    }
    if (typeof amountPaid === "number") {
      saleData.amountDue = amountPaid;
    }

    const sale = new Sale(saleData);
    await sale.save();

    // 3. Update stock quantities
    for (const item of sale.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );
    }

    // 4. Update customer's amountOwed if partial payment
    if (hasPartialPayment && customerName && typeof amountPaid === "number") {
      // Calculate how much is owed for this sale
      const amountOwed = sale.totalAmount - amountPaid;
      await Customer.findByIdAndUpdate(customerName, {
        $inc: { amountOwed: amountOwed },
      });
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
