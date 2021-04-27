const Product = require("../models/product");
const truffle_connect = require("../connection/bc.js");

/*  GET */

exports.getProduct = async (req, res, next) => {
    try {
        //const user = await User.findById(req.params.id);
        if (req.query.bcProductId) {
            console.log("QRCODE - Traçabilité");
            /*
            truffle_connect.backTrackProduct(function (answer) {
                res.status(200).json({
                    success: true,
                    data: answer,
                });
            });
            */
            res.status(200).json({
                success: true,
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
