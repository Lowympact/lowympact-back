// This middleware hash the given user password so as to store the newly created hash in the DB

const bcrypt = require("bcryptjs");

exports.hashPassword = (password) => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};
