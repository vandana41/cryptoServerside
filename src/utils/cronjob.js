// src/utils/cronJob.js
const cron = require("node-cron");
const { fetchCryptoPrices } = require("../services/cryptoService");

cron.schedule("0 */2 * * *", async () => {
  console.log("Running scheduled task: Fetching crypto prices...");
  await fetchCryptoPrices();
});
