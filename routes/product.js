const express = require("express");

const paginationFiltering = require("../middleware/paginationFiltering");
const { protect, authorize } = require("../middleware/auth");

const {
  getProducts,
  getProduct,
} = require("../controllers/product");

const Product = require("../models/product");

const router = express.Router();

// anything below will use the middleware
// router.use(protect);
// router.use(authorize("admin"));

/**
 * @swagger
 * /api/v1/products/:
 *   get:
 *     description: Get every products
 *     responses:
 *       200:
 *         description: Returns every products
 */
router.route("/").get(paginationFiltering(Product), getProducts).get(getProducts);

module.exports = router;
