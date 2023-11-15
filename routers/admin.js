const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const authMiddlewere = require("../middlewares/auth");

router.get("/", authMiddlewere, adminController.index);

module.exports = router;

