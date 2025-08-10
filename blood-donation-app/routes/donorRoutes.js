const express = require('express');
const Donor = require('../models/donorModel');

const router = express.Router();

// POST /register - Register a new donor
router.post('/register', async (req, res) => {
  try {
    const donorData = req.body;
    const donor = new Donor(donorData);
    await donor.save();
    res.status(201).json({ message: 'Donor registered successfully', donor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /search - Search for donors
router.get('/search', async (req, res) => {
  try {
    const { bloodGroup, location } = req.query;
    const query = {};
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (location) query.location = location;
    const donors = await Donor.find(query);
    res.json(donors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
