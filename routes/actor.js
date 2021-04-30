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
//router.use(protect);
//router.use(authorize("admin"));
// router.use(checkApiKey);

/**
 * //@swagger
 * /api/v1/actors:
 *  post:
 *      summary: Register a new actor
 *      description: Register a new actor on the application
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                              name:
 *                                  type: string
 *                              password:
 *                                  type: string
 *      produces:
 *          - application/json
 *      parameters:
 *        - name: authorization
 *          in: header
 *          description: API-Key with Bearer prefix
 *          schema:
 *              type: string
 *              format: uuid
 *              required: true
 *       responses:
 *          200:
 *              description: OK
 */
router.route("/").post(registerActor);

/**
 * //@swagger
 * /api/v1/actors:
 *   post:
 *     summary: Login an actor
 *     description: >
 *        Login a new actor on the application
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
 *      - name: email
 *        in: body
 *        description: email of the actor
 *        type: string
 *        required: true
 *      - name: password
 *        in: body
 *        description: Password of the actor to connect and decrypt wallet
 *        type: string
 *        required: true
 *     responses:
 *       200:
 *         description: jwt
 */
router.route("/login").post(loginActor);
/**
 * //@swagger
 * /api/v1/actors:
 *   get:
 *     summary: Get an actor by id
 *     description: >
 *        Get actor's information
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
 *      - name: jwt
 *        in: header
 *        description: Authentification of the actor
 *        type: JWT
 *        required: true
 *      - name: actorId
 *        in: path
 *        description: id of the actor
 *        type: string
 *        required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.route("/:idActor").get(checkJWT, getActor);

/**
 * //@swagger
 * /api/v1/actors:
 *   put:
 *     summary: Update the actor's model
 *     description: >
 *        Update the actor's related informations
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
 *      - name: jwt
 *        in: header
 *        description: Authentification of the actor
 *        type: JWT
 *        required: true
 *      - name: actorId
 *        in: query
 *        description: id of the actor
 *        type: string
 *        required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.route("/:idActor").put(checkJWT, updateActor);

/**
 * //@swagger
 * /api/v1/actors/{idActor}:
 *   delete:
 *     summary: Delete an actor
 *     description: >
 *        Delete an existing actor of the application
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
 *      - name: jwt
 *        in: header
 *        description: Authentification of the actor
 *        type: JWT
 *        required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.route("/:idActor").delete(checkJWT, deleteActor);

module.exports = router;
