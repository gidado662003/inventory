const mongoose = require("mongoose");
const { Schema } = mongoose;

const saleItemSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    salePrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
    },
    paymentType: {
      type: String,
      required: true,
      enum: ["Cash", "Transfer", "Outstanding"],
    },

    soldBy: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const saleSchema = new Schema({
  items: [saleItemSchema],

  totalAmount: {
    type: Number,
  },
  amountDue: {
    type: Number,
    default: 0,
  },
  customerName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: function () {
      return this.items.some((item) => item.paymentType === "Outstanding");
    },
  },
  date: {
    type: Date,
    default: Date.now,
    index: true,
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
saleSchema.pre("save", function (next) {
  // Update lastUpdated timestamp
  this.lastUpdated = new Date();

  this.items.forEach((item) => {
    item.totalPrice = item.salePrice * item.quantity;
  });

  this.totalAmount = this.items.reduce((acc, item) => acc + item.totalPrice, 0);

  if (this.items.some((item) => item.paymentType === "Outstanding")) {
    if (!this.amountDue) {
      this.amountDue = 0; // treat as zero if not set
    }
    this.amountDue = this.totalAmount - this.amountDue;
  } else {
    // Fully paid → nothing owed
    this.amountDue = this.totalAmount;
    this.amountDue = 0;
  }
  next();
});

const Sale = mongoose.model("Sale", saleSchema);
module.exports = Sale;
