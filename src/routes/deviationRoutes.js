// src/routes/deviationRoutes.js
const express = require("express");
const { getPriceDeviation } = require("../controllers/deviationController");
const router = express.Router();

router.get("/deviation", getPriceDeviation);

module.exports = router;
