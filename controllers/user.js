const User = require("../models/user");
const Axios = require("axios");
const { hashPassword } = require("../middleware/hashPassword");
const { findOne } = require("../models/user");

/*  GET */

exports.getUser = async (req, res, next) => {
    try {
        const userId = req.jwt.id;
        if (userId == req.params.userId) {
            // Get user informations
            const user = await User.findById(userId);

            let scannedProduct = user.history.length;

            let cartedProduct = 0;
            for (let i = 0; i < user.cart.length; i++) {
                cartedProduct += user.cart[i].quantity;
            }

            res.status(200).json({
                success: true,
                data: user,
                scannedProduct: scannedProduct,
                cartedProduct: cartedProduct,
            });
            next();
        } else {
            // A user try to access to another user
            res.status(401).json({
                success: false,
                message: "You're not authorized to access this route",
            });
            next();
        }
    } catch (error) {
        next(error);
    }
};

exports.getUserHistory = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        //uncomment next line for authenttication check
        // const userId = req.jwt.id;
        if (userId == req.params.userId) {
            // Get user informations
            let userHistory = await User.findById(userId, "history");

            if (userHistory && userHistory.history) {
                let promises = userHistory.history.map(async (p) => {
                    if (p) {
                        const apiRes = await Axios({
                            method: "GET",
                            url: `https://world.openfoodfacts.org/api/v0/product/${p.barcode}.json/`,
                        });

                        return {
                            id: p._id,
                            name: apiRes.data.product.product_name,
                            image: apiRes.data.product.image_url,
                            brand: apiRes.data.product.brands,
                            label: apiRes.data.product.ecoscore_grade,
                            barcode: p.barcode,
                            bcProductId: p.bcProductAddress,
                            date: p.insertAt,
                        };
                    } else {
                        return {};
                    }
                });

                const response = await Promise.all(promises);

                res.status(200).json({
                    success: true,
                    data: response,
                });
                next();
            } else {
                res.status(200).json({
                    success: true,
                    data: [],
                });
                next();
            }
        } else {
            // A user try to access to another user

            res.status(401).json({
                message: "You're not authorized to access this route",
            });
            next();
        }
    } catch (error) {
        next(error);
    }
};

exports.itemCurrentCart = async (req, res, next) => {
    try {
        if (req.jwt.id != req.params.userId) {
            // An user try to modify the history of another user
            res.status(401).json({
                message: "You're not authorized to access this route",
            });
            next();
        }

        const user = await User.findById(req.params.userId);

        var prevdate = new Date();
        prevdate.setHours(prevdate.getHours() - 2);

        let item;
        for (i = 0; i < user.cart.length; i++) {
            element = user.cart[i];
            if (element.date > prevdate) {
                if (
                    req.query.bcProductAddress != undefined &&
                    element.bcProductAddress == req.query.bcProductAddress
                ) {
                    item = element;
                    break;
                } else if (
                    element.barcode == req.params.barcode &&
                    req.query.bcProductAddress == undefined &&
                    element.bcProductAddress == undefined
                ) {
                    item = element;
                    break;
                }
            }
        }

        if (!item) {
            res.status(200).json({
                success: true,
                data: {
                    barcode: req.params.barcode,
                    bcProductAddress: req.query.bcProductAddress,
                    quantity: 0,
                },
            });
            next();
        }

        res.status(200).json({
            success: true,
            data: item,
        });
        next();
    } catch (error) {
        next(error);
    }
};

exports.getUserStatistics = async (req, res, next) => {
    try {
        const userId = req.jwt.id;
        if (userId == req.params.userId) {
            const user = await User.findById(userId);

            const typeAggregate = req.query.typeAggregate;

            const typeStatistic = req.query.typeStatistic;

            let statistics;

            if (typeStatistic == "ecoscore") {
                statistics = {
                    ecoscore: {
                        a: 0,
                        b: 0,
                        c: 0,
                        d: 0,
                        e: 0,
                        unknown: 0,
                    },
                };

                user.cart.forEach((el) => {
                    statistics.ecoscore[el.ecoscore] += el.quantity;
                });
            } else if (typeStatistic == "carbonImpact") {
                statistics = {
                    carbonImpact: {},
                };
                let dateIntervalStep;
                let now = Date.now();
                switch (typeAggregate) {
                    case "fromBeginning":
                        dateIntervalStep = Math.floor((now - user.createdAt) / (1000 * 3600 * 24));
                        if (dateIntervalStep < 30) {
                            // weekly
                            dateIntervalStep = 1000 * 3600 * 24 * 7;
                            statistics.carbonImpact.data = Array(
                                Math.floor((now - user.createdAt) / (1000 * 3600 * 24 * 7) + 1)
                            );
                            statistics.carbonImpact.unit = "weekly";
                        } else if (dateIntervalStep < 365) {
                            // monthly
                            dateIntervalStep = 1000 * 3600 * 24 * 30;
                            statistics.carbonImpact.data = Array(
                                Math.floor((now - user.createdAt) / (1000 * 3600 * 24 * 30) + 1)
                            );
                            statistics.carbonImpact.unit = "monthly";
                        } else {
                            // yearly
                            dateIntervalStep = 1000 * 3600 * 24 * 365;
                            statistics.carbonImpact.data = Array(
                                Math.floor((now - user.createdAt) / (1000 * 3600 * 24 * 365) + 1)
                            );
                            statistics.carbonImpact.unit = "yearly";
                        }
                        break;
                    case "yearly":
                        dateIntervalStep = 1000 * 3600 * 24 * 365;
                        statistics.carbonImpact.data = Array(
                            Math.floor((now - user.createdAt) / (1000 * 3600 * 24 * 365) + 1)
                        );
                        statistics.carbonImpact.unit = "yearly";
                        break;
                    case "monthly":
                        dateIntervalStep = 1000 * 3600 * 24 * 30;
                        statistics.carbonImpact.data = Array(12);
                        statistics.carbonImpact.unit = "monthly";
                        break;
                    case "weekly":
                        dateIntervalStep = 1000 * 3600 * 24 * 7;
                        statistics.carbonImpact.data = Array(6);
                        statistics.carbonImpact.unit = "weekly";
                        break;
                    default:
                        res.status(400).json({
                            success: false,
                            message: "Unknown or undefined type of agregate (typeAggregate)",
                        });
                        next();
                        break;
                }

                for (let i = 0; i < statistics.carbonImpact.data.length; i++) {
                    statistics.carbonImpact.data[i] = {
                        offset: -i,
                        impact: 0,
                        nbProducts: 0,
                        nbProductUnknow: 0,
                    };
                }

                user.cart.forEach((el) => {
                    let index = Math.max(Math.floor((now - el.date) / dateIntervalStep), 0);
                    if (index < statistics.carbonImpact.data.length && el.carbonImpact >= 0) {
                        statistics.carbonImpact.data[index].nbProducts += el.quantity;
                        statistics.carbonImpact.data[index].impact += el.quantity * el.carbonImpact;
                    } else if (index < statistics.carbonImpact.data.length) {
                        statistics.carbonImpact.data[index].nbProductUnknow += el.quantity;
                    }
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Unknown or undefined type of statistics (typeStatistic)",
                });
                next();
            }

            res.status(200).json({
                success: true,
                statistics: statistics,
            });
            next();
        } else {
            // A user try to access to another user
            res.status(401).json({
                success: false,
                message: "You're not authorized to access this route",
            });
            next();
        }
    } catch (error) {
        next(error);
    }
};

/*  POST */

exports.register = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        password = hashPassword(password);
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

                user.password = hashPassword(req.body.newPassword);
            }

            user.save();

            res.status(200).json({
                success: true,
                data: user,
            });
            next();
        } else {
            // A user try to modify another user
            res.status(401).json({
                success: false,
                message: "You're not authorized to access this route",
            });
            next();
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
        expires: new Date(Date.now() + process.env.JWT_EXPIRE * 24 * 3600 * 1000),
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
            _id: user._id,
        });
};

exports.addProductInHistory = async (req, res, next) => {
    try {
        const userId = req.jwt.id;

        if (userId == req.params.userId) {
            const user = await User.findById(userId);

            let data = {
                barcode: req.body.barcode,
            };

            if (req.body.bcProductAddress) {
                data.bcProductAddress = req.body.bcProductAddress;
            }

            // Check the presence of the same product in history
            let previousMatchingProduct;
            if (req.body.bcProductAddress) {
                previousMatchingProduct = user.history.find(
                    (t) => t.barcode == data.barcode && t.bcProductAddress == data.bcProductAddress
                );
            } else {
                previousMatchingProduct = user.history.find(
                    (t) => t.barcode == data.barcode && !t.bcProductAddress
                );
            }

            if (previousMatchingProduct) {
                // Update product's date
                previousMatchingProduct.insertAt = Date.now();
            } else {
                // Add product in user history
                user.history.push(data);
            }

            user.save();

            res.status(200).json({
                success: true,
                data: user,
            });
            next();
        } else {
            // A user try to modify the history of another user
            res.status(401).json({
                message: "You're not authorized to access this route",
            });
            next();
        }
    } catch (error) {
        next(error);
    }
};

exports.updateCart = async (req, res, next) => {
    try {
        if (req.jwt.id == req.params.userId) {
            const user = await User.findById(req.params.userId);

            if (req.body.quantityDelta == undefined || typeof req.body.quantityDelta == "string") {
                res.status(400).json({
                    message: "You have to choose a quantityDelta",
                });
                next();
            }

            if (req.body.ecoscore == undefined) {
                res.status(400).json({
                    message: "You have to specify the ecoscore",
                });
                next();
            }

            if (req.body.carbonImpact == undefined || typeof req.body.carbonImpact == "string") {
                res.status(400).json({
                    message: "You have to specify the carbon impact",
                });
                next();
            }

            //req.body.quantityDelta = Number(req.body.quantityDelta);

            var prevdate = new Date();
            prevdate.setHours(prevdate.getHours() - 2);

            let item;
            let itemIndex;
            for (i = 0; i < user.cart.length; i++) {
                element = user.cart[i];
                if (element.date > prevdate) {
                    if (
                        req.body.bcProductAddress != undefined &&
                        element.bcProductAddress == req.body.bcProductAddress
                    ) {
                        item = element;
                        itemIndex = i;
                        break;
                    } else if (
                        element.barcode == req.body.barcode &&
                        req.body.bcProductAddress == undefined &&
                        element.bcProductAddress == undefined
                    ) {
                        item = element;
                        itemIndex = i;
                        break;
                    }
                }
            }

            if (!item) {
                //create a new item
                if (req.body.quantityDelta >= 1) {
                    item = {
                        barcode: req.body.barcode,
                        bcProductAddress: req.body.bcProductAddress
                            ? req.body.bcProductAddress
                            : undefined,
                        date: Date.now(),
                        quantity: req.body.quantityDelta,
                        ecoscore: req.body.ecoscore,
                        carbonImpact: req.body.carbonImpact,
                    };
                    user.cart.push(item);

                    user.save();
                } else {
                    res.status(400).json({
                        message: "You can't set a negative quantity for a new item",
                    });
                    next();
                }
            } else {
                if (req.body.quantityDelta + item.quantity < 0) {
                    res.status(400).json({
                        message: "You can't remove more product than there are in the cart",
                    });
                    next();
                } else {
                    if (item.quantity + req.body.quantityDelta <= 0) {
                        // delete the item
                        user.cart.splice(itemIndex, 1);
                    } else {
                        // update the item's quantity
                        item.quantity += req.body.quantityDelta;
                    }

                    user.save();
                }
            }

            res.status(200).json({
                success: true,
                data: user,
            });
            next();
        } else {
            // An user try to modify the history of another user
            res.status(401).json({
                message: "You're not authorized to access this route",
            });
            next();
        }
    } catch (error) {
        next(error);
    }
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
            next();
        } else {
            // A user try to delete another user
            res.status(401).json({
                success: false,
                message: "You're not authorized to access this route",
            });
            next();
        }
    } catch (error) {
        next(error);
    }
};
