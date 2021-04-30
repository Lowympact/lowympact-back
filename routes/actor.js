const express = require("express");

const { checkApiKey } = require("../middleware/apiKey");
const { checkJWT } = require("../middleware/checkJWT");

const {
    registerActor,
    loginActor,
    getActor,
    updateActor,
    deleteActor,
} = require("../controllers/actor");

const { check } = require("express-validator");

const router = express.Router();

// anything below will use the middleware
// router.use(checkApiKey);

/**
 * @swagger
 * /actors/:
 *   post:
 *     summary: Register a new actor
 *     tags:
 *       - actors
 *     description: Signup a new company in the application
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
 *       - name: name
 *         in: body
 *         description: Actor's name
 *         schema:
 *           type: string
 *           required: true
 *       - name: email
 *         in: body
 *         description: Actor's email
 *         schema:
 *           type: string
 *           format: email
 *           required: true
 *       - name: password
 *         in: body
 *         description: Actor's password
 *         schema:
 *           type: string
 *           format: password
 *           required: true
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: An actor with the specified email already exist
 */
router.route("/").post(registerActor);

/**
 * @swagger
 * /actors/login:
 *   post:
 *     summary: Login an actor
 *     tags:
 *       - actors
 *     description: Signin an actor in the application and get the JWT Token relatives to the session
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
 *         description: actor's email
 *         schema:
 *           type: string
 *           format: email
 *           required: true
 *       - name: password
 *         in: body
 *         description: actor's password
 *         schema:
 *           type: string
 *           format: password
 *           required: true
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: No actor with the specified email was found.
 */
router.route("/login").post(loginActor);

/**
 * @swagger
 * /actors/{idActor}:
 *   get:
 *     summary: Gets an actor by id
 *     tags:
 *       - actors
 *     description: >
 *       A detailed description of the actor identified by his id.
 *       This route is protected and needs the user to be auth.
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
 *         description: JWT Token for the actor's session
 *         schema:
 *           type: string
 *           format: uuid
 *           required: false
 *       - name: idActor
 *         in: path
 *         description: Actor identifier
 *         schema:
 *           type: string
 *           required: true
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: No actor with the specified ID was found.
 */
router.route("/:idActor").get(checkJWT, getActor);

/**
 * @swagger
 * /actors/{idActor}:
 *   put:
 *     summary: Update actor's informations
 *     tags:
 *       - actors
 *     description: >
 *        Update the name and/or the password.
 *        This route is protected and needs the user to be auth.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         in: body
 *         description: Actor's name
 *         schema:
 *           type: string
 *           required: false
 *       - name: email
 *         in: body
 *         description: Actor's email
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
router.route("/:idActor").put(checkJWT, updateActor);

/**
 * @swagger
 * /actors/{idActor}:
 *   delete:
 *     summary: Delete an actor account
 *     tags:
 *       - actors
 *     description: >
 *        Delete an actor account from the database.
 *        This route is protected and need the user to be auth.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: idActor
 *         in: path
 *         description: Actor's id
 *         schema:
 *           type: string
 *           required: true
 *     responses:
 *       200:
 *        description: OK
 */
router.route("/:idActor").delete(checkJWT, deleteActor);

module.exports = router;
