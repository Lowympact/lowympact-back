const Product = require("../models/product");
const Transaction = require("../contracts/transaction");

const NodeGeocoder = require("node-geocoder");
const NodeGeocoderOptions = {
    provider: "google",
    apiKey: process.env.GOOGLEAPI_KEY,
    format: "json",
};
const geocoder = NodeGeocoder(NodeGeocoderOptions);

const { getName } = require("country-list");

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
            //let traceabilityData = await Transaction.getProductHistory(req.query.bcProductId);
            let traceabilityData = [
                {
                    id: "transaction2",
                    buyer: {
                        id: "CAR-69000",
                        name: "Carrefour Lyon Part Dieu",
                        type: "maker",
                        localisation: {
                            longitude: "4.857217",
                            latitude: "45.761467",
                        },
                    },
                    seller: {
                        id: "BAR-85025 ",
                        name: "Barilla Protenza",
                        type: "producer",
                        localisation: {
                            longitude: "15.7028457",
                            latitude: "41.0728191",
                        },
                    },
                    productsInput: [[Array]],
                    productsOutput: [[Array]],
                    transport: "Charette",
                    date: 1619794500,
                    isFinished: false,
                    isAccepted: false,
                },
                {
                    id: "transaction1",
                    buyer: {
                        id: "CAR-69000",
                        name: "Carrefour Lyon Part Dieu",
                        type: "maker",
                        localisation: {
                            longitude: "4.857217",
                            latitude: "45.761467",
                        },
                    },
                    seller: {
                        id: "CAR-69100",
                        name: "Carrefour Villeurbanne",
                        type: "maker",
                        localisation: {
                            longitude: "4.88037",
                            latitude: "45.76478",
                        },
                    },
                    productsInput: [[Array]],
                    productsOutput: [[Array]],
                    transport: "Train",
                    date: 1619794499,
                    isFinished: false,
                    isAccepted: false,
                },
            ];

            // Fill the traceability with reverse geocoding
            await reverseGeocodingOnTraceability(traceabilityData);

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
// Reverse Geocoder where traceabilityData is passed by reference (complex js object)
async function reverseGeocodingOnTraceability(traceabilityData) {
    for (let i = 0; i < traceabilityData.length; i++) {
        let latToFind = traceabilityData[i].buyer.localisation.latitude;
        let longToFind = traceabilityData[i].buyer.localisation.longitude;
        if (latToFind && longToFind) {
            let reverseGeocoding = await geocoder.reverse({ lat: latToFind, lon: longToFind });
            traceabilityData[i].buyer.localisation.country = reverseGeocoding[0].country;
            traceabilityData[i].buyer.localisation.city = reverseGeocoding[0].city;
            traceabilityData[i].buyer.localisation.address = reverseGeocoding[0].formattedAddress;
        }

        latToFind = traceabilityData[i].seller.localisation.latitude;
        longToFind = traceabilityData[i].seller.localisation.longitude;
        if (latToFind && longToFind) {
            reverseGeocoding = await geocoder.reverse({ lat: latToFind, lon: longToFind });
            traceabilityData[i].seller.localisation.country = reverseGeocoding[0].country;
            traceabilityData[i].seller.localisation.city = reverseGeocoding[0].city;
            traceabilityData[i].seller.localisation.address = reverseGeocoding[0].formattedAddress;
        }
    }
}

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
