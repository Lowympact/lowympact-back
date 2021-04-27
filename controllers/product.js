const Product = require("../models/product");
const { reverseGeocoder } = require("../util/geocoder");
const Transaction = require("../contracts/transaction");

/*  GET */

exports.getProduct = async (req, res, next) => {
    try {
        //const user = await User.findById(req.params.id);
        if (req.query.bcProductId) {
            console.log("QRCODE - Traçabilité");
            /*
            Transaction.getProductHistory(function (answer) {
                res.status(200).json({
                    success: true,
                    data: answer,
                });
            });
            */
            let geocoderTest = await reverseGeocoder(45.78264, 4.878073);
            res.status(200).json({
                success: true,
                geocoder: geocoderTest,
            });
        } else {
            console.log("BARCODE - Impact");
            res.status(501).json({
                success: false,
                message: "not implemented",
                //data: user,
            });
        }
    } catch (err) {
        next(err);
    }
};

/*  POST */

/*  PUT */

/*  DELETE */
