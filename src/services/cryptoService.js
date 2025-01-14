// services/backgroundJob.js

const axios = require('axios');
const nodeSchedule = require('node-schedule');
const CryptoPrice = require('../models/CryptoPrice');

const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,matic-network,ethereum&vs_currencies=usd&include_market_cap=true&include_24hr_change=true';

async function fetchAndStoreStats() {
    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        console.log(data,"this is the data fetched");
        const coins = [
            { coin: 'bitcoin', price: data.bitcoin.usd, marketCap: data.bitcoin.usd_market_cap, change24h: data.bitcoin.usd_24h_change },
            { coin: 'matic-network', price: data['matic-network'].usd, marketCap: data['matic-network'].usd_market_cap, change24h: data['matic-network'].usd_24h_change },
            { coin: 'ethereum', price: data.ethereum.usd, marketCap: data.ethereum.usd_market_cap, change24h: data.ethereum.usd_24h_change }
        ];

        for (const coinData of coins) {
            const newStat = new CryptoPrice(coinData);
            await newStat.save();
        }

        console.log('Successfully fetched and stored cryptocurrency data');
    } catch (error) {
        console.error('Error fetching data from CoinGecko:', error);
    }
}

// Schedule the job to run every 2 hours
nodeSchedule.scheduleJob('0 */2 * * *', fetchAndStoreStats);

// Export the function
module.exports = { fetchAndStoreStats };
