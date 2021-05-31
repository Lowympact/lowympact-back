const express = require("express");

const { checkApiKey } = require("../middleware/apiKey");
const { checkJWT } = require("../middleware/checkJWT");

const {
    register,
    login,
    getUser,
    getUserHistory,
    updateDetails,
    forgotPassword,
    deleteUser,
    addProductInHistory,
    updateCart,
    itemCurrentCart,
    addReview,
    getUserStatistics,
} = require("../controllers/user");

const router = express.Router();

// anything below will use the middleware
// router.use(checkApiKey);

/**
 * @swagger
 * /users/:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - users
 *     description: Signup a new user in the application
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
 *       - name: username
 *         in: body
 *         description: Username
 *         schema:
 *           type: string
 *           required: true
 *       - name: email
 *         in: body
 *         description: User email
 *         schema:
 *           type: string
 *           format: email
 *           required: true
 *       - name: password
 *         in: body
 *         description: User password
 *         schema:
 *           type: string
 *           format: password
 *           required: true
 *     responses:
 *       201:
 *         description: CREATED
 *       400:
 *         description: A user with the specified ID already exist
 */
router.route("/").post(register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - users
 *     description: Signin a user in the application and get the JWT for cookies
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
 *       - name: email
 *         in: body
 *         description: User ID
 *         schema:
 *           type: string
 *           format: email
 *           required: true
 *       - name: password
 *         in: body
 *         description: User password
 *         schema:
 *           type: string
 *           format: password
 *           required: true
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: A user with the specified ID was not found.
 */
router.route("/login").post(login);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Gets a user by id
 *     tags:
 *       - users
 *     description: >
 *       A detailed description of the user identified his id.
 *       This route is protected and need the user to be auth.
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
 *       - name: authorization
 *         in: header
 *         description: JWT Token for the user's session (can be stored in cookies)
 *         schema:
 *           type: string
 *           format: uuid
 *           required: false
 *       - name: userId
 *         in: path
 *         description: User Identifier
 *         schema:
 *           type: string
 *           required: true
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: A user with the specified ID was not found.
 */
router.route("/:userId").get(checkJWT, getUser);

/**
 * @swagger
 * /users/{userId}/history:
 *   get:
 *     summary: Gets a user history by id
 *     tags:
 *       - users
 *     description: >
 *       A detailed description of the user history,  identified his id.
 *       This route is protected and need the user to be auth.
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
 *       - name: authorization
 *         in: header
 *         description: JWT for the user's session (can be stored in cookies)
 *         schema:
 *           type: string
 *           format: uuid
 *           required: false
 *       - name: userId
 *         in: path
 *         description: User Identifier
 *         schema:
 *           type: string
 *           required: true
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: A user with the specified ID was not found.
 */
router.route("/:userId/history").get(checkJWT, getUserHistory);

/**
 * @swagger
 * /users/{userId}/history:
 *   put:
 *     summary: Add a product in user's history
 *     tags:
 *       - users
 *     description: >
 *       Add the barcode and the blockchain address (if it exists) of
 *       the product in user's history. This route is protected and
 *       need the user to be auth.
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
 *       - name: authorization
 *         in: header
 *         description: JWT for the user's session (can be stored in cookies)
 *         schema:
 *           type: string
 *           format: uuid
 *           required: false
 *       - name: userId
 *         in: path
 *         description: User Identifier
 *         schema:
 *           type: string
 *           required: true
 *       - name: barcode
 *         in: body
 *         description: Product barcode
 *         schema:
 *           type: string
 *           required: true
 *       - name: bcProductAddress
 *         in: body
 *         description: Product blockchain address
 *         schema:
 *           type: string
 *           required: false
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: A user try to modify the history of another user
 *       404:
 *         description: A user with the specified ID was not found.
 */
router.route("/:userId/history").put(checkJWT, addProductInHistory);

/**
 * @swagger
 * /users/{userId}/review:
 *   put:
 *     summary: Add a review in user
 *     tags:
 *       - users
 *     description: >
 *       add a review
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
 *       - name: authorization
 *         in: header
 *         description: JWT for the user's session (can be stored in cookies)
 *         schema:
 *           type: string
 *           format: uuid
 *           required: false
 *       - name: userId
 *         in: path
 *         description: User Identifier
 *         schema:
 *           type: string
 *           required: true
 *       - name: message
 *         in: body
 *         description: review
 *         schema:
 *           type: string
 *           required: true
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: A user try to modify the history of another user
 *       404:
 *         description: A user with the specified ID was not found.
 */
router.route("/:userId/review").put(checkJWT, addReview);

/**
 * @swagger
 * /users/{userId}/cart:
 *   put:
 *     summary: Add a quantity of a product in user's cart
 *     tags:
 *       - users
 *     description: >
 *       Add more or less of a quantity of a product in the user's cart.
 *       The quantity is set in the quantityDelta variable. Use positiv value increase the quantity, and negativ to decrease it.
 *       If the quantityDelta is less than the quantity of the product, an error is send.
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
 *       - name: authorization
 *         in: header
 *         description: JWT for the user's session (can be stored in cookies)
 *         schema:
 *           type: string
 *           format: uuid
 *           required: false
 *       - name: userId
 *         in: path
 *         description: User Identifier
 *         schema:
 *           type: string
 *           required: true
 *       - name: barcode
 *         in: body
 *         description: Product barcode
 *         schema:
 *           type: string
 *           required: true
 *       - name: bcProductAddress
 *         in: body
 *         description: Product blockchain address
 *         schema:
 *           type: string
 *           required: false
 *       - name: ecoscore
 *         in: body
 *         description: Ecoscore of the product
 *         schema:
 *           type: string
 *           enum: [a, b, c, d, e, unknown]
 *           required: true
 *       - name: impactCarbon
 *         in: body
 *         description: Carbon Impact of the product
 *         schema:
 *           type: number
 *           required: true
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: A user try to modify the history of another user
 *       404:
 *         description: A user with the specified ID was not found.
 */
router.route("/:userId/cart").put(checkJWT, updateCart);

/**
 * @swagger
 * /users/{userId}/cart/{barcode}:
 *   get:
 *     summary: Get the actual item in the cart
 *     tags:
 *       - users
 *     description: >
 *       The actual quantity of the wanted item previously added into the cart, within a span time of two hours.
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
 *       - name: authorization
 *         in: header
 *         description: JWT for the user's session (can be stored in cookies)
 *         schema:
 *           type: string
 *           format: uuid
 *           required: false
 *       - name: userId
 *         in: path
 *         description: User identifier
 *         schema:
 *           type: string
 *           required: true
 *       - name: barcode
 *         in: path
 *         description: Product barcode
 *         schema:
 *           type: string
 *           required: true
 *       - name: bcProductAddress
 *         in: query
 *         description: Product traceability identifier
 *         schema:
 *           type: string
 *           required: false
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: A user with the specified ID was not found.
 */
router.route("/:userId/cart/:barcode").get(checkJWT, itemCurrentCart);

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Update/change user's informations
 *     tags:
 *       - users
 *     description: >
 *        Update/change the username and/or password. For
 *        the password, the current password must be given
 *        This route is protected and need the user to be auth.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         in: body
 *         description: Username
 *         schema:
 *           type: string
 *           required: false
 *       - name: email
 *         in: body
 *         description: Email
 *         schema:
 *           type: string
 *           format: email
 *           required: false
 *       - name: currentPassword
 *         in: body
 *         description: Current password
 *         schema:
 *           type: string
 *           format: password
 *           required: false
 *       - name: newPassword
 *         in: body
 *         description: New password
 *         schema:
 *           type: string
 *           required: false
 *     responses:
 *       200:
 *        description: OK
 *       400:
 *        description: ERROR
 */
router.route("/:userId").put(checkJWT, updateDetails);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete a user account
 *     tags:
 *       - users
 *     description: >
 *        Delete a user account from the database
 *        This route is protected and need the user to be auth.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: User's id
 *         schema:
 *           type: string
 *           required: true
 *     responses:
 *       200:
 *        description: OK
 */
router.route("/:userId").delete(checkJWT, deleteUser);

// Request password reset
/**
 * @swagger
 * /users/forgot-password:
 *   get:
 *     summary: Start password reset
 *     tags:
 *       - users
 *     description: Start a password reset process for a user
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
 *       - name: email
 *         in: body
 *         description: User ID
 *         schema:
 *           type: string
 *           format: email
 *           required: true
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: A user with the specified ID was not found.
 */
//router.route("/forgot-password").get(forgotPassword);

/**
 * @swagger
 * /users/{userId}/statistics:
 *   get:
 *     summary: Get the statistics of a user.
 *     tags:
 *       - users
 *     description: Get the statistics of the user. We can specify if we want the ecoscore or the carbon impact
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
 *       - name: userId
 *         in: path
 *         description: User Id
 *         schema:
 *           type: string
 *           required: true
 *       - name: typeStatistic
 *         in: query
 *         description: Type of the statistic
 *         schema:
 *           type: string
 *           required: true
 *           enum: [ecoscore, impactCarbon]
 *       - name: typeAggregate
 *         in: query
 *         description: Type of the aggregation
 *         schema:
 *           type: string
 *           required: false
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Unknown type of statistic or aggregate
 *       401:
 *         description: A user try to access to the statistics of another user
 */
router.route("/:userId/statistics").get(checkJWT, getUserStatistics);

module.exports = router;
