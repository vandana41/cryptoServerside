// src/controllers/statsController.js
const CryptoPrice = require("../models/CryptoPrice");

const getCryptoStats = async (req, res) => {
  const { coin } = req.query;

  // Validate query parameter
  if (!["bitcoin", "matic-network", "ethereum"].includes(coin)) {
    return res.status(400).json({ error: "Invalid coin specified" });
  }

  try {
    // Find the latest entry for the requested cryptocurrency
    const cryptoData = await CryptoPrice.findOne({ name: new RegExp(coin, "i") })
      .sort({ timestamp: -1 });

    if (!cryptoData) {
      return res.status(404).json({ error: "Data not found for the specified coin" });
    }

    // Respond with formatted data
    return res.json({
      price: cryptoData.priceUSD,
      marketCap: cryptoData.marketCapUSD,
      "24hChange": cryptoData.change24h
    });

  } catch (error) {
    console.error("Error fetching crypto stats:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getCryptoStats };
