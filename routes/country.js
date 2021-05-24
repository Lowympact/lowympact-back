const express = require("express");

const { checkApiKey } = require("../middleware/apiKey");

const { getCountry } = require("../controllers/country");

const { check } = require("express-validator");

const router = express.Router();

// anything below will use the middleware
// router.use(checkApiKey);

/**
 * @swagger
 * /countries/{name_id}:
 *   get:
 *     summary: Gets a country by name_id
 *     tags:
 *      - country
 *     description: >
 *        Get country geocoordinates
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
 *      - name: name_id
 *        in: path
 *        description: country name id  "en:russia"
 *        type: string
 *        required: true
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: BAD REQUEST
 *       404:
 *         description: COUNTRY NOT FOUND
 */
router.route("/:name_id").get(getCountry);

module.exports = router;
