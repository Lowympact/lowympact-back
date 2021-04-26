const Product = require("../models/product");

/*  GET */

exports.getProducts = async (req, res, next) => {
  let query;

  try {
    /* if (req.params.proprietaireId) {
        //if proprietaireId exist
        //the route should be: /proprietaires/:proprietaireId/annonces
        const annonces = await Annonce.find({
          proprietaire: req.params.proprietaireId
        });
        res.status(200).json({
          success: true,
          count: annonces.length,
          data: annonces
        });
      } else {
        //otherwise (proprietaireId doenst exist)
        //the route should be: /annonces */

    //get plurial items => passing by paginationFiltering middleware,
    //in which we set correctly the field results of res
    res.status(200).json(res.results);
    //}
  } catch (err) {
    next(err);
  }
};

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
