const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Please add a product name"],
    unique: true,
  }
});

module.exports = mongoose.model("Product", ProductSchema);