const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to update lastUpdated timestamp
productSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
