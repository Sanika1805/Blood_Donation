// Entry point for the Blood Donation App server
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Donor routes
const donorRoutes = require('./routes/donorRoutes');
app.use('/api/v1/donors', donorRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Blood Donation API!');
});

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} and connected to MongoDB`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });
