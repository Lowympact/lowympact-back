const Product = require("../models/product");
const Transaction = require("../contracts/transaction");

const openGeocoder = require("node-open-geocoder");

const simulation = require("../contracts/simulation");

/*  GET */

exports.getProduct = async (req, res, next) => {
    try {
        //const user = await User.findById(req.params.id);
        console.log(req.query);
        if (req.query.bcProductId) {
            console.log("QRCODE - Traçabilité");

            // Mock Front
            if (req.query.bcProductId == "idbc") {
                req.query.bcProductId = simulation.mockTransactionFront;
            }

            // Blockchain's Traceability
            let traceabilityData = await Transaction.getProductHistory(req.query.bcProductId);

            // Traceability's impact
            let transportCO2Impact = computeTransportCO2Impact(traceabilityData);

            // TODO : Others env impacts

            res.status(200).json({
                success: true,
                data: {
                    traceability: traceabilityData,
                    transportCO2Impact: transportCO2Impact,
                },
            });
            /*
            Transaction.getProductHistory(function (answer) {
                res.status(200).json({
                    success: true,
                    data: answer,
                });
            });
            */
            /*
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
            */
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

// Private functions
// kg CO2 per km or miles
function computeTransportCO2Impact(traceabilityData) {
    let impactGlobal = 0;
    traceabilityData.forEach((element) => {
        let impactCoeff;
        switch (element.transport) {
            case "Plane":
                impactCoeff = 0.152;
                break;
            case "Train":
                impactCoeff = 0.065;
                break;
            case "Boat":
                impactCoeff = 0.7;
                break;
            case "Truck":
                impactCoeff = 0.1;
                break;
            case "Charette":
                impactCoeff = 0.001;
                break;
            default:
                break;
        }
        lat1 = parseFloat(element.seller.localisation.latitude);
        long1 = parseFloat(element.seller.localisation.longitude);
        lat2 = parseFloat(element.buyer.localisation.latitude);
        long2 = parseFloat(element.buyer.localisation.longitude);
        dist = getDistanceFromLatLonInKm(lat1, long1, lat1, long2);
        impactGlobal += impactCoeff * dist;
    });
    return impactGlobal;
}

function getDistanceFromLatLonInKm(latitude1, longitude1, latitude2, longitude2) {
    var p = 0.017453292519943295; //This is  Math.PI / 180
    var c = Math.cos;
    var a =
        0.5 -
        c((latitude2 - latitude1) * p) / 2 +
        (c(latitude1 * p) * c(latitude2 * p) * (1 - c((longitude2 - longitude1) * p))) / 2;
    var R = 6371; //  Earth distance in km so it will return the distance in km
    return 2 * R * Math.asin(Math.sqrt(a));
}
