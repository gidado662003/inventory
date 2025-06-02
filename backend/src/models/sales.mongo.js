const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  salePrice: {
    type: Number,
    required: true,
  },
});

const saleSchema = new mongoose.Schema({
  items: [saleItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;
