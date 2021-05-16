const jwt = require("jsonwebtoken");

//const AlternativesModel = require("../models/alternative");
const mongoose = require("mongoose");
const AlternativeModel = require("../models/alternative");

/*  GET */

exports.getAlternative = async (req, res, next) => {
    try {
        //const AlternativesModel = mongoose.model("alternatives");
        if (req.params.codeCiqual) {
            // Mock Front

            let alternativeModel = await AlternativeModel.findOne({
                code_ciqual: req.params.codeCiqual,
            });

            console.log(alternativeModel); //reste null jsp pourquoi

            res.status(200).json({
                success: true,
                data: {
                    alternativesInfos: alternativeModel,
                },
            });
        } else {
            res.status(400).json({
                success: false,
                message: "codeCiqual is missing",
            });
        }
    } catch (err) {
        next(err);
    }
};

/*  POST */

/*  PUT */

/*  DELETE */
