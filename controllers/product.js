const Product = require("../models/product");
const { reverseGeocoder } = require("../util/geocoder");
const Transaction = require("../contracts/transaction");

const openGeocoder = require("node-open-geocoder");

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
            //var geocoderTest = await reverseGeocoder(45.78264, 4.878073);
            var lat = 45.78264;
            var long = 4.878073;
            openGeocoder()
                .reverse(long, lat)
                .end((err, geocoderRes) => {
                    if (!err) {
                        res.status(200).json({
                            success: true,
                            message: geocoderRes,
                        });
                    } else {
                        res.status(200).json({
                            success: false,
                            message: "reverse geocoder error",
                        });
                    }
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
