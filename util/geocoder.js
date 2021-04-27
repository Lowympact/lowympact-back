const openGeocoder = require("node-open-geocoder");

exports.reverseGeocoder = function (lat, long) {
    openGeocoder()
        .reverse(lat, long)
        .end((err, res) => {
            if (!err) {
                console.log(res);
            }
        });
};
