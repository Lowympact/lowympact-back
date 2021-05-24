const jwt = require("jsonwebtoken");

//const AlternativesModel = require("../models/alternative");
const mongoose = require("mongoose");
const Country = require("../models/country");

/*  GET */

exports.getCountry = async (req, res, next) => {
    try {
        if (req.params.name_id) {
            let country = await Country.findOne({
                name_id: req.params.name_id,
            });

            res.status(200).json({
                success: true,
                data: {
                    country: country,
                },
            });
        } else {
            res.status(400).json({
                success: false,
                message: "country not found",
            });
        }
    } catch (err) {
        next(err);
    }
};

/*  POST */

/*  PUT */

/*  DELETE */
