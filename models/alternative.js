const mongoose = require("mongoose");

const AlternativeSchema = new mongoose.Schema({
    ciqual_code: { type: String },
    a: [
        {
            name: {
                type: String,
            },
            img_url: {
                type: String,
            },
            id: { type: String },

            eco_score: { type: Number },
            label: { type: String },
        },
    ],
    b: [
        {
            name: {
                type: String,
            },
            img_url: {
                type: String,
            },
            id: { type: String },

            eco_score: { type: Number },
            label: { type: String },
        },
    ],
    c: [
        {
            name: {
                type: String,
            },
            img_url: {
                type: String,
            },
            id: { type: String },

            eco_score: { type: Number },
            label: { type: String },
        },
    ],
    d: [
        {
            name: {
                type: String,
            },
            img_url: {
                type: String,
            },
            id: { type: String },

            eco_score: { type: Number },
            label: { type: String },
        },
    ],
});

module.exports = mongoose.model("Alternative", AlternativeSchema);
