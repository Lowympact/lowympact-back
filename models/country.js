const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    code: {
        type: String,
    },
    name_id: {
        type: String,
    },
    coordinates: [
        [
            [
                [
                    {
                        type: Number,
                    },
                ],
            ],
        ],
    ],
});

module.exports = mongoose.model("Country", CountrySchema);
