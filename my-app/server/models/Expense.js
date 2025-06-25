const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: {
    type: mongoose.Decimal128,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    enum: [
      'Rent', 'Utilities', 'Groceries', 'Transportation', 'Entertainment',
      'Insurance', 'Healthcare', 'Education', 'Dining Out', 'Shopping',
      'Travel', 'Gifts', 'Charity', 'Subscriptions', 'Debt Repayment', 'Miscellaneous', 'Other'
    ],
    default: 'Other',
  },
  dateSpent: {
    type: Date,
    required: true,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accounts',
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    default: null,
  },
},
{
  timestamps: true, // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Expense', expenseSchema);
