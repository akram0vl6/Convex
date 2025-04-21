const { Schema, model, default: mongoose } = require("mongoose");

const ProductSchema = new Schema({
  id: { type: Number },
  name: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String },
  weight: { type: Number },
  category: { type: String },
  discount: { type: String },
  sold: {type: Number},
  like: {type: Number},
  createdBy: {
    id: { type: String },
    name: { type: String },
    email: { type: String },
  },
});


const ProductModel =
  mongoose.models.ProductModel || mongoose.model("ProductModel", ProductSchema);

module.exports = ProductModel;
