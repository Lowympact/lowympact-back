const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    _id: Number,
    productName: {
        type: String,
        required: [true, "Please add a product name"],
    },
});

module.exports = mongoose.model("Product", ProductSchema);
