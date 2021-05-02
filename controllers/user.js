const User = require("../models/user");

/*  GET */

exports.getUser = async (req, res, next) => {
    try {
        const userId = req.jwt.id;
        if (userId == req.params.userId) {
            // Get user informations
            const user = await User.findById(userId);
            res.status(200).json({
                success: true,
                data: user,
            });
        } else {
            // A user try to access to another user
            console.log("You're not authorized to access this route");
        }
    } catch (error) {
        next(error);
    }
};

/*  POST */

exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        //Create user
        const user = await User.create({
            username,
            email,
            password,
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email&password
        if (!email || !password) {
            let err = new Error();
            err.message = "Please provide an email and a password";
            return next(err);
        }

        // Check for user
        // password is set to not be displayed by default
        // the returned password is encrypted
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            let err = new Error();
            err.message = "No user found";
            return next(err);
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            let err = new Error();
            err.message = "Incorrect password";
            return next(err);
        }
        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

/*  PUT */

//Update user details
exports.updateDetails = async (req, res, next) => {
    try {
        const userId = req.jwt.id;

        if (userId == req.params.userId) {
            const user = await User.findById(userId).select("+password");
            if (req.body.username) {
                user.username = req.body.username;
            }
            if (req.body.email) {
                user.email = req.body.email;
            }
            if (req.body.newPassword && req.body.currentPassword) {
                if (!(await user.matchPassword(req.body.currentPassword))) {
                    let error = new Error();
                    error.message = "Incorrect password";
                    return next(error);
                }

                user.password = req.body.newPassword;
            }

            user.save();

            res.status(200).json({
                success: true,
                data: user,
            });
        } else {
            // A user try to modify another user
            console.log("You're not authorized to access this route");
        }
    } catch (error) {
        next(error);
    }
};

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //Create token according to the current user we are dealing with
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 3600 * 1000),
        httpOnly: true,
    };

    if (process.env.MODE_ENV === "production") {
        options.secure = true;
    }

    res.status(statusCode)
        //add cookie
        .cookie("token", token, options)
        .json({
            success: true,
            token,
            id: user.id,
        });
};

/*  DELETE */

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.jwt.id;

        if (userId == req.params.userId) {
            User.deleteOne({ _id: userId }, function (err) {
                if (err) {
                    return next(err);
                }
            });

            res.status(200).json({
                success: true,
            });
        } else {
            // A user try to delete another user
            console.log("You're not authorized to access this route");
        }
    } catch (error) {
        next(error);
    }
};
