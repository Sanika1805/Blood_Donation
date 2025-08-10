const mongoose = require('mongoose');

const validBloodGroups = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: validBloodGroups
  },
  contactNumber: {
    type: String
  },
  location: {
    type: String
  },
  lastDonationDate: {
    type: Date,
    default: Date.now
  }
});

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;
