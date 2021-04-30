// This middleware hash the given user password so as to store the newly created hash in the DB

const bcrypt = require("bcrypt");

exports.hashPassword = (req, res, next) => {
    bcrypt.hash(req.body.actorPassword, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        req.body.actorPasswordHashed = hash;
        next();
    });
};
