const mongoose = require('mongoose');

const accountsSchema = new mongoose.Schema({
    accountId: {
        type: String, 
        default: () => new mongoose.Types.ObjectId().toString(), 
        required: true,
        unique: true
      },
      accountName: {
        type: String,
        required: true
      },
      accountType: {
        type: String,
        required: true
      },
      balance: {
        type: mongoose.Decimal128,
        required: true
      },
      currency: {
        type: String,
        required: true
      },
      interestRate: {
        type: mongoose.Decimal128,
        default: 0.0
      },
      minimumBalance: {
        type: mongoose.Decimal128,
        default: 0.0
      },
      withdrawalLimit: {
        type: Number,
        default: 0
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }, {
      timestamps: true 
});


const Accounts = mongoose.model('Accounts', accountsSchema);
module.exports = Accounts;