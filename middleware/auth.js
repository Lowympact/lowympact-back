const jwt = require("jsonwebtoken");
const User = require("../models/user");

//Protect Routers
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      //set token from bearer token
      token = req.headers.authorization.split(" ")[1];
    } else if (process.env.NODE_ENV === "production" && req.cookies.token) {
      console.log("true");
      //set token from cookies
      token = req.cookies.token;
    }

    //Make sure token exists
    if (!token) {
      let err = new Error();
      err.message = "Not authorized to access this route";
      return next(err);
    }

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //we have access to user in any route which uses this middleware
    req.user = await User.findById(decoded.id);
    //console.log(req.user);
    next();
  } catch (error) {
    next(error);
  }
};

//Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    //array.includes
    if (!roles.includes(req.user.role)) {
      let err = new Error();
      err.message = `User role ${req.user.role} is not authorized to access the route`;
      return next(err);
    }
    next();
  };
};
