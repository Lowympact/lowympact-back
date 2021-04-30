const express = require("express");

const paginationFiltering = require("../middleware/paginationFiltering");
const { checkApiKey } = require("../middleware/apiKey");
const { checkJWT } = require("../middleware/checkjwt");

const { register, login, getUser, updateDetails, forgotPassword } = require("../controllers/user");

const router = express.Router();

// anything below will use the middleware
// router.use(protect);
// router.use(authorize("admin"));
// router.use(checkApiKey);

// Get a specific user
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

// Modify user information and/or password
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
 */
router.route("/:userId").put(checkJWT, updateDetails);

// Register a new user
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
 *         description: User ID
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

// Login
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - users
 *     description: Signin a user in the application and get the JWT Token for cookies
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

module.exports = router;
