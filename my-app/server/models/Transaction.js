const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    type: {
        type: String,
        enum: ['Income', 'Expense'],
        required: true,
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        maxlength: 200,
    },
    transactionRefId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'type' // Dynamic reference based on the `type` field
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Transaction', transactionSchema);
