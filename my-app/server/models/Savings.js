const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema({
    goalId: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
        required: true,
        unique: true
    },
    goalName: {
        type: String,
        required: true
    },
    targetAmount: {
        type: mongoose.Decimal128,
        required: true
    },
    currentAmount: {
        type: mongoose.Decimal128,
        default: 0.0
    },
    priority: {
        type: Number,
        required: true,
        min: 1 // 1 for highest priority
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    dailySavings: {
        type: mongoose.Decimal128,
        default: 0.0
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        enum: ['ongoing', 'achieved', 'paused', 'canceled'],
        default: 'ongoing'
    }
}, { 
    timestamps: true 
});

const SavingsGoal = mongoose.model('SavingsGoal', savingsGoalSchema);
module.exports = SavingsGoal;
