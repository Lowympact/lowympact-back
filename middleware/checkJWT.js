const jwt = require("jsonwebtoken");

// Check if the token is correct
exports.checkJWT = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization) {
            token = req.headers.authorization;
        } else if (req.cookies.token) {
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

        // We have access to jwt in any route which uses this middleware
        req.jwt = decoded;

        next();
    } catch (error) {
        next(error);
    }
};
