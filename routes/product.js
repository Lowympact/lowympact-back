const express = require("express");

const paginationFiltering = require("../middleware/paginationFiltering");
const { protect, authorize } = require("../middleware/auth");

const { getProduct } = require("../controllers/product");

const Product = require("../models/product");

const router = express.Router();

// anything below will use the middleware
// router.use(protect);
// router.use(authorize("admin"));

/**
 * @swagger
 * /api/v1/products/{barcode}:
 *   get:
 *     summary: Gets a product by barcode
 *     description: >
 *        A detailed description of the product identified by barcode.
 *        If the **bcProductId** is passed by parameter, add
 *        traceability information on response
 *     produces:
 *      - application/json
 *     parameters:
 *      - name: barcode
 *        in: path
 *        description: Product Barcode
 *        type: integer
 *        required: true
 *      - name: bcProductId
 *        in: query
 *        description: Product Blockchain ID
 *        type: integer
 *        required: false
 *     responses:
 *       200:
 *         description: OK
 */
router.route("/:barcode/:bcProductId").get(getProduct);

module.exports = router;
