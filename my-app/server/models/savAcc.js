const mongoose = require('mongoose');

const savAccSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: true
  },
  initialDeposit: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  }
});

const SavAcc = mongoose.model('SavAcc', savAccSchema);

module.exports = SavAcc;
