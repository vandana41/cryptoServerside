// src/controllers/deviationController.js
const CryptoPrice = require("../models/CryptoPrice");

const calculateStandardDeviation = (prices) => {
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
  return Math.sqrt(variance).toFixed(2);
};

const getPriceDeviation = async (req, res) => {
  const { coin } = req.query;

  // Validate query parameter
  if (!["bitcoin", "matic-network", "ethereum"].includes(coin)) {
    return res.status(400).json({ error: "Invalid coin specified" });
  }

  try {
    // Fetch the last 100 price records for the requested coin
    const prices = await CryptoPrice.find({ name: new RegExp(coin, "i") })
      .sort({ timestamp: -1 })
      .limit(100)
      .select("priceUSD -_id");

    if (prices.length === 0) {
      return res.status(404).json({ error: "Not enough data for the specified coin" });
    }

    // Extract price values from the documents
    const priceValues = prices.map(record => record.priceUSD);
    
    // Calculate standard deviation
    const deviation = calculateStandardDeviation(priceValues);

    return res.json({ deviation: parseFloat(deviation) });

  } catch (error) {
    console.error("Error calculating price deviation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getPriceDeviation };
