const express = require("express");

const paginationFiltering = require("../middleware/paginationFiltering");
const { protect, authorize } = require("../middleware/auth");

const { getUsers, getUser, createUser, updateUser, deleteUser } = require("../controllers/user");

const User = require("../models/user");

const router = express.Router();

// anything below will use the middleware
// router.use(protect);
// router.use(authorize("admin"));

/**
 * @swagger
 * /api/v1/users/:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.route("/").get(paginationFiltering(User), getUsers).get(getUsers);

module.exports = router;
