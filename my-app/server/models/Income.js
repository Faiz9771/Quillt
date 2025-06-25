const mongoose = require('mongoose');

// Income Schema Definition
const incomeSchema = new mongoose.Schema({
  amount: {
    type: mongoose.Schema.Types.Decimal128, // Use Decimal128 for precise amounts
    required: true, // Amount is mandatory
  },
  source: {
    type: String,
    enum:[
      'Job', 'Rental Income', 'Dividends', 'Gifts', 'Other'
    ],
    required: true, // Source of income (e.g., salary, freelance)
  },
  category: {
    type: String,
    enum: [
      'Salary',
      'Freelance',
      'Business Income',
      'Dividends',
      'Interest',
      'Rental Income',
      'Royalties',
      'Gifts',
      'Pensions',
      'Social Security',
      'Grants',
      'Side Gigs',
      'Consulting',
      'Affiliate Marketing',
      'Online Content',
      'Other'
    ],
    default: 'Other', // Default value if not provided
  },
  dateReceived: {
    type: Date,
    required: true, // Date when income was received
    default: Date.now, // Default to current date
  },
  accountId: {
    type: String, // Storing accountId as a string
    default: () => new mongoose.Types.ObjectId().toString(), // Generate a new ObjectId as string
    required: true, // Ensure the income is linked to an account
  },
  isRecurring: {
    type: Boolean,
    default: false, // Indicates if the income is recurring
  },
  frequency: {
    type: String,
    enum: ['Weekly', 'Monthly', 'Yearly', null], // Frequency of recurrence
    required: function () { return this.isRecurring; } // Make frequency required if recurring
  },
  description: {
    type: String,
    required: false, // Description is optional
    trim: true, // Remove any extra whitespace
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Export the Income model
module.exports = mongoose.model('Income', incomeSchema);
