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
      enum: ["Cash", "Transfer", "Unpaid"],
    },
  },
  { _id: false }
);

const saleSchema = new Schema({
  items: [saleItemSchema],

  totalAmount: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
    index: true,
  },
});
saleSchema.pre("save", function (next) {
  this.items.forEach((item) => {
    item.totalPrice = item.salePrice * item.quantity;
  });

  this.totalAmount = this.items.reduce((acc, item) => acc + item.totalPrice, 0);
  next();
});

const Sale = mongoose.model("Sale", saleSchema);
module.exports = Sale;
