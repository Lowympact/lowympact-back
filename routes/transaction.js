const express = require("express");

const { checkJWT } = require("../middleware/checkJWT");

const { checkApiKey } = require("../middleware/apiKey");

const {
    createTransaction,
    acceptTransaction,
    finishTransaction,
} = require("../controllers/transaction");

const router = express.Router();

// anything below will use the middleware
router.use(checkApiKey);

/**
 * @swagger
 * /transactions/:
 *   post:
 *     summary: Create a new transaction
 *     tags:
 *       - transactions
 *     description: Create a new transaction between a seller and a buyer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: api-key
 *         in: header
 *         description: API-Key
 *         schema:
 *           type: string
 *           format: uuid
 *           required: true
 *       - name: buyerId
 *         in: body
 *         description: Buyer Id
 *         schema:
 *           type: string
 *           required: true
 *       - name: Products Input
 *         in: body
 *         description: All the input products of the transaction
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 required: true
 *               addressTransaction:
 *                 type: string
 *                 required: true
 *           required: true
 *       - name: Products Output
 *         in: body
 *         description: All the output products of the transaction
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 required: true
 *               addressTransaction:
 *                 type: string
 *                 required: true
 *           required: true
 *       - name: Transport type
 *         in: body
 *         description: Id of the transport type
 *         schema:
 *           type: number
 *           required: true
 *     responses:
 *       201:
 *         description: CREATED
 */
router.route("/").post(checkJWT, createTransaction);

/**
 * @swagger
 * /transactions/{transactionAddress}/accept:
 *   put:
 *     summary: Accept a transaction
 *     tags:
 *       - transactions
 *     description: Accept a given transaction. Only the buyer can accept the transaction
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: api-key
 *         in: header
 *         description: API-Key
 *         schema:
 *           type: string
 *           format: uuid
 *           required: true
 *       - name: transactionAddress
 *         in: path
 *         description: Address of the transaction
 *         schema:
 *           type: string
 *           required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.route("/:transactionAddress/accept").put(checkJWT, acceptTransaction);

/**
 * @swagger
 * /transactions/{transactionAddress}/finish:
 *   put:
 *     summary: Finish a transaction
 *     tags:
 *       - transactions
 *     description: Finish a given transaction. Only the buyer can finish the transaction
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: api-key
 *         in: header
 *         description: API-Key
 *         schema:
 *           type: string
 *           format: uuid
 *           required: true
 *       - name: transactionAddress
 *         in: path
 *         description: Address of the transaction
 *         schema:
 *           type: string
 *           required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.route("/:transactionAddress/finish").put(checkJWT, finishTransaction);

module.exports = router;
