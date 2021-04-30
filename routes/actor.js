const express = require("express");

const { protect, authorize } = require("../middleware/auth");
const { checkApiKey } = require("../middleware/apiKey");

const { createActor } = require("../controllers/actor");

const { check } = require("express-validator");

const router = express.Router();

// anything below will use the middleware
//router.use(protect);
//router.use(authorize("admin"));
// router.use(checkApiKey);

/**
 * @swagger
 * /api/v1/actor/auth:
 *   get:
 *     summary: Gets a product by barcode
 *     description: >
 *        Register a new actor on the application
 *     produces:
 *      - application/json
 *     parameters:
 *      - name: authorization
 *        in: header
 *        description: API-Key with Bearer prefix
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *      - name: name
 *        in: query
 *        description: Public name of the actor
 *        type: string
 *        required: true
 *      - name: password
 *        in: query
 *        description: Password of the actor to connect and decrypt wallet
 *        type: string
 *        required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.route("/").post(createActor);

module.exports = router;
