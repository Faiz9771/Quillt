const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    liquidBalance: {
        total: {
            type: mongoose.Decimal128,  // High precision for financial values
            required: true,
            default: 0
        },
        categorizedInflows: {
            salary: { type: mongoose.Decimal128, default: 0 },
            businessIncome: { type: mongoose.Decimal128, default: 0 },
            freelance: { type: mongoose.Decimal128, default: 0 },
            otherSources: { type: mongoose.Decimal128, default: 0 }
        },
        essentialOutflows: {
            total: { type: mongoose.Decimal128, default: 0 },
            breakdown: {
                food: { type: mongoose.Decimal128, default: 0 },
                transportation: { type: mongoose.Decimal128, default: 0 },
                housing: { type: mongoose.Decimal128, default: 0 },
                utilities: { type: mongoose.Decimal128, default: 0 },
                healthcare: { type: mongoose.Decimal128, default: 0 },
                otherEssentials: { type: mongoose.Decimal128, default: 0 }
            }
        },
        nonEssentialOutflows: {
            total: { type: mongoose.Decimal128, default: 0 },
            breakdown: {
                entertainment: { type: mongoose.Decimal128, default: 0 },
                diningOut: { type: mongoose.Decimal128, default: 0 },
                shopping: { type: mongoose.Decimal128, default: 0 },
                travel: { type: mongoose.Decimal128, default: 0 },
                subscriptions: { type: mongoose.Decimal128, default: 0 },
                miscellaneous: { type: mongoose.Decimal128, default: 0 }
            }
        }
    },
    investments: [
        {
            type: {
                type: String,
                enum: ["bonds", "stocks", "mutual funds", "real estate", "gold"],
                required: true
            },
            amount: {
                type: mongoose.Decimal128,
                required: true
            },
            buyPrice: {
                type: mongoose.Decimal128,
                required: true
            }
        }
    ],
    loanDetails: {
        totalLoan: {
            type: mongoose.Decimal128,
            required: true
        },
        interestRate: {
            type: mongoose.Decimal128,
            required: true
        },
        loanTerm: {
            type: Number,  // Term in months or years, as preferred
            required: true
        },
        emi: {
            type: mongoose.Decimal128,
            required: true
        },
        payoffDate: {
            type: Date,
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Analysis', analysisSchema);
