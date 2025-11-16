const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{11}$/, // Nigerian phone number format
    },
    amountOwed: {
      type: Number,
      default: 0,
      min: 0,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
    },
    address: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
