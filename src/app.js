// src/app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const statsRoutes = require("./routes/statsRoutes");
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DATABASEB_URI ;
// src/app.js
const deviationRoutes = require("./routes/deviationRoutes");
app.use("/api", deviationRoutes);

// Connect to MongoDB
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use(express.json());
app.use("/api", statsRoutes);

// Start background job
require("./utils/cronjob.js");
