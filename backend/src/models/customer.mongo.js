const mongoose = require("mongoose");

const itemsOwedSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const owedGroupSchema = new mongoose.Schema(
  {
    items: [
      {
        itemName: {
          type: String,
          required: true,
          trim: true,
          maxlength: 120,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    outstanding: {
      type: Number,
      default: 0,
      min: 0,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

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
    itemsOwed: {
      type: [itemsOwedSchema],
      default: [],
    },
    owedGroups: {
      type: [owedGroupSchema],
      default: [],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
