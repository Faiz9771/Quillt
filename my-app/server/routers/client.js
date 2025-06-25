const express = require('express'); // Import Express

// Accounts
const {
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
  deposit,
  withdraw,
  transferFunds
} = require('../controllers/client.js'); // Import account-related functions

// Income
const {
  addIncome,
  getAllIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome
} = require('../controllers/client.js'); // Import income-related functions

// Expense
const {
  addExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense
} = require('../controllers/client.js'); // Import expense-related functions

const {
  createTransaction,
    getAllTransactions,
    getTransactionsByType,
    getTransactionsByAccount,
    updateTransaction,
    deleteTransaction
} = require('../controllers/client.js'); // Import transaction-related functions

const {
  createAnalysis,
  updateAnalysis,
  getAnalysisByUserId,
  deleteAnalysis 
} = require('../controllers/client.js'); // Import analysis-related functions

const { getMarketPrices } = require('../controllers/client.js');

const {
  createSavings,
  updateSavings,
  getSavingsById,
  deleteSavings,
  getAllSavings
}
 = require('../controllers/client.js');

const router = express.Router();

// Account routes
router.post('/accounts', createAccount);
router.get('/accounts', getAllAccounts);
router.get('/accounts/:id', getAccountById);
router.put('/accounts/:id', updateAccount);
router.delete('/accounts/:id', deleteAccount);
router.post('/accounts/:id/deposit', deposit);
router.post('/accounts/:id/withdraw', withdraw);
router.post('/accounts/transfer', transferFunds);

// Income routes
router.post('/incomes', addIncome);
router.get('/incomes', getAllIncomes);
router.get('/incomes/:id', getIncomeById);
router.put('/incomes/:id', updateIncome);
router.delete('/incomes/:id', deleteIncome);

// Expense routes
router.post('/expenses', addExpense);
router.get('/expenses', getExpenses);
router.get('/expenses/:id', getExpense);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);

// Transaction routes
router.post('/transactions', createTransaction);
router.get('/transactions', getAllTransactions);
router.get('/transactions/type/:type', getTransactionsByType);
router.get('/transactions/account/:accountId', getTransactionsByAccount);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);

// Analysis routes
router.post('/analysis', createAnalysis);
router.get('/analysis/:userId', getAnalysisByUserId);
router.put('/analysis/:userId', updateAnalysis);
router.delete('/analysis/:userId', deleteAnalysis);
router.get('/market-prices', getMarketPrices);

// Savings routes
router.post('/savings', createSavings);
router.get('/savings/:id', getSavingsById);
router.put('/savings/:id', updateSavings);
router.delete('/savings/:id', deleteSavings);
router.get('/savings', getAllSavings);

module.exports = router; // Export the router
