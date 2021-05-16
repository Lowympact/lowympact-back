const express = require("express");

const { checkApiKey } = require("../middleware/apiKey");

const { getAlternative } = require("../controllers/alternative");

const { check } = require("express-validator");

const router = express.Router();

// anything below will use the middleware
// router.use(checkApiKey);

/**
 * @swagger
 * /alternatives/{codeCiqual}:
 *   get:
 *     summary: Gets a product by barcode
 *     tags:
 *      - products
 *     description: >
 *        A detailed description of the product identified by barcode.
 *        With the **bcProductId** is passed by parameter, add
 *        traceability information on response
 *     produces:
 *      - application/json
 *     parameters:
 *      - name: api-key
 *        in: header
 *        description: API-Key
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *      - name: barcode
 *        in: path
 *        description: Product Barcode
 *        type: integer
 *        required: true
 *      - name: bcProductId
 *        in: query
 *        description: Product Blockchain Address where this product is an output
 *        type: string
 *        required: true
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: BAD REQUEST
 *       404:
 *         description: PRODUCT NOT FOUND ON THE BLOCKCHAIN
 */
router.route("/:codeCiqual").get(getAlternative);

module.exports = router;
