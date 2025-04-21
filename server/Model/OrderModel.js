const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ссылаемся на коллекцию пользователей
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      img: { type: String },
      createdBy: { type: Object },
    },
  ],
  createdBy: { type: Object },
  totalWeight: { type: Number },
  totalItems: { type: Number },
  totalPrice: { type: Number },
  city: { type: String, required: true },
  address: { type: String, required: true },
  receiver: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: "pending" },
});

module.exports = mongoose.model("Order", OrderSchema);
