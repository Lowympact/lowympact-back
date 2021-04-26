const Product = require("../models/product");

/*  GET */

exports.getProduct = async (req, res, next) => {
  try {
    //const user = await User.findById(req.params.id);
    res.status(200).json({
      success: true,
      //data: user,
    });
  } catch (err) {
    next(err);
  }
};

/*  POST */

/*  PUT */

/*  DELETE */
