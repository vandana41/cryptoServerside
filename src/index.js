require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const CryptoStats = require('./models/CryptoPrice');
const { fetchAndStoreStats } = require('./services/CryptoService');

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        fetchAndStoreStats();
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

    
app.get('/stats', async (req, res) => {
    const { coin } = req.query;
    
    if (!['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
        return res.status(400).json({ error: 'Invalid coin parameter' });
    }

    try {
        const latestStats = await CryptoStats.findOne({ coin }).sort({ timestamp: -1 });
        if (!latestStats) {
            return res.status(404).json({ error: 'Data not found for the requested coin' });
        }

        return res.json({
            price: latestStats.price,
            marketCap: latestStats.marketCap,
            "24hChange": latestStats.change24h
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

app.get('/deviation', async (req, res) => {
    const { coin } = req.query;
    
    if (!['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
        return res.status(400).json({ error: 'Invalid coin parameter' });
    }

    try {
        const records = await CryptoStats.find({ coin }).sort({ timestamp: -1 }).limit(100);
        if (records.length < 2) {
            return res.status(400).json({ error: 'Not enough data to calculate deviation' });
        }

        const prices = records.map(record => record.price);
        const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;

        const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
        const standardDeviation = Math.sqrt(variance);

        return res.json({ deviation: standardDeviation.toFixed(2) });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to calculate deviation' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
