// src/routes/statsRoutes.js
const express = require("express");
const { getCryptoStats } = require("../controllers/statsController");
const router = express.Router();

router.get("/stats", getCryptoStats);

module.exports = router;
