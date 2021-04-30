const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Check if the token is correct
exports.checkUserToken = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization) {
            token = req.headers.authorization;
        } else if (process.env.NODE_ENV === "production" && req.cookies.token) {
            // Set token from cookies
            token = req.cookies.token;
        }

        // Make sure token exists
        if (!token) {
            let err = new Error();
            err.message = "Not authorized to access this route";
            return next(err);
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // We have access to user in any route which uses this middleware
        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        next(error);
    }
};
