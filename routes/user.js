const express = require("express");

const paginationFiltering = require("../middleware/paginationFiltering");
const { checkApiKey } = require("../middleware/apiKey");

const { getUsers, getUser, createUser, updateUser, deleteUser } = require("../controllers/user");

const User = require("../models/user");

const router = express.Router();

// anything below will use the middleware
// router.use(protect);
// router.use(authorize("admin"));
// router.use(checkApiKey);

router.route("/").get(paginationFiltering(User), getUsers).get(getUsers);

module.exports = router;
