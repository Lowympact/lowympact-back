const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    _id: Number,
    productName: {
        type: String,
        required: [true, "Please add a product name"],
    },
    transactionAddress: {
        type: String,
        default: "0x0000000000000000000000000000000000000000",
    },
});

module.exports = mongoose.model("Product", ProductSchema);
