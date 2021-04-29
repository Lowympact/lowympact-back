const Product = require("../models/product");
const Transaction = require("../contracts/transaction");

const openGeocoder = require("node-open-geocoder");

const simulation = require("../contracts/simulation");

/*  GET */

exports.getProduct = async (req, res, next) => {
    try {
        //const user = await User.findById(req.params.id);
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
            case Transaction.enums.TransportType.Plane:
                impactCoeff = 0.152;
                break;
            case Transaction.enums.TransportType.Train:
                impactCoeff = 0.065;
                break;
            case Transaction.enums.TransportType.Boat:
                impactCoeff = 0.7;
                break;
            case Transaction.enums.TransportType.Truck:
                impactCoeff = 0.1;
                break;
            case Transaction.enums.TransportType.Charette:
                impactCoeff = 0.001;
                break;
            default:
                break;
        }
        lat1 = float(element.seller.localisation.latitude);
        long1 = float(element.seller.localisation.longitude);
        lat2 = float(element.buyer.localisation.latitude);
        long2 = float(element.buyer.localisation.longitude);
        dist = getDistanceFromLatLonInKm(lat1, long1, lat1, long2, "km");
        impactGlobal += impact * dist;
    });
    return impactGlobal;
}

function getDistanceFromLatLonInKm(latitude1, longitude1, latitude2, longitude2, units) {
    var earthRadius = 6371; // Radius of the earth in km
    var dLat = deg2rad(latitude2 - latitude1); // deg2rad below
    var dLon = deg2rad(longitude2 - longitude1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(latitude1)) *
            Math.cos(deg2rad(latitude2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = earthRadius * c;
    var miles = d / 1.609344;

    if (units == "km") {
        return d;
    } else {
        return miles;
    }
}
