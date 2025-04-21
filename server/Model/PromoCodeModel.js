const { Schema, model, default: mongoose } = require("mongoose");

const PromoCode = new Schema({
  code: { type: String, required: true },
  title: { type: String },
  discount: { type: Number, required: true },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  }, // ID поставщика
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  isUsed: { type: Boolean},
  expiryDate: { type: Date,}, 
  count: {type: Number}
});

module.exports = model("PromoCode", PromoCode);
