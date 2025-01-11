// src/services/cryptoService.js
const axios = require("axios");
const CryptoPrice = require("../models/CryptoPrice");

const COINS = ["bitcoin", "matic-network", "ethereum"];
const API_URL = "https://api.coingecko.com/api/v3/simple/price";

const fetchCryptoPrices = async () => {
  try {
    const { data } = await axios.get(API_URL, {
      params: {
        ids: COINS.join(","),
        vs_currencies: "usd",
        include_market_cap: "true",
        include_24hr_change: "true"
      }
    });
    console.log('Fetched data from CoinGecko:', JSON.stringify(data, null, 2));


    for (const coin of COINS) {
      const cryptoData = {
        name: coin.charAt(0).toUpperCase() + coin.slice(1).replace("-", " "),
        symbol: coin.split("-")[0].toUpperCase(),
        priceUSD: data[coin].usd,
        marketCapUSD: data[coin].usd_market_cap,
        change24h: data[coin].usd_24h_change
      };

      await CryptoPrice.create(cryptoData);
    }
    console.log("Crypto prices updated successfully!");
  } catch (error) {
    console.error("Error fetching crypto prices:", error.message);
  }
};

module.exports = { fetchCryptoPrices };
