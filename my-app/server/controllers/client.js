const Accounts = require("../models/Accounts.js"); // Import the Accounts model

const { v4: uuidv4 } = require("uuid"); // Import uuid for generating unique IDs
// Importing mongoose
const mongoose = require('mongoose');
//Accounts
exports.createAccount = async (req, res) => {
  const { accountName, accountType, balance, currency, interestRate, minimumBalance, withdrawalLimit } = req.body;

  // Log the incoming request data
  console.log('Incoming request data:', req.body);

  try {
    // Validate the incoming data (you can add more specific validations as needed)
    if (!accountName || !accountType || !balance || !currency) {
      console.log('Validation error: Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newAccount = new Accounts({
      accountId: uuidv4(), // Generate unique UUID
      accountName,
      accountType,
      balance,
      currency,
      interestRate,
      minimumBalance,
      withdrawalLimit,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Log the account object before saving
    console.log('Account object to be saved:', newAccount);

    const savedAccount = await newAccount.save();
    console.log('Account saved successfully:', savedAccount); // Log the saved account

    res.status(201).json(savedAccount);
  } catch (error) {
    // Log the error details
    console.error('Error creating account:', error);
    console.error('Error details:', error);
    res.status(500).json({ error: 'Error creating account' });
  }
};

// Get all accounts
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Accounts.find();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching accounts' });
  }
};

// Get account by ID
exports.getAccountById = async (req, res) => {
  const { id } = req.params;

  try {
    const account = await Accounts.findOne({ accountId: id });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching account' });
  }
};

// Update account (e.g., balance, withdrawal limit, etc.)
exports.updateAccount = async (req, res) => {
  const { id } = req.params;
  const { balance, withdrawalLimit, interestRate } = req.body;

  try {
    const account = await Accounts.findOne({ _id: id });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    account.balance = balance ?? account.balance;
    account.withdrawalLimit = withdrawalLimit ?? account.withdrawalLimit;
    account.interestRate = interestRate ?? account.interestRate;
    account.updatedAt = new Date();

    const updatedAccount = await account.save();
    res.status(200).json(updatedAccount);
  } catch (error) {
    res.status(500).json({ error: 'Error updating account' });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const account = await Accounts.findOneAndDelete({ _id: id });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting account' });
  }
};

// Deposit into account
exports.deposit = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const account = await Accounts.findOne({ _id: id });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    account.balance += amount;
    account.updatedAt = new Date();

    const updatedAccount = await account.save();
    res.status(200).json({ message: `Deposited ${amount} into account`, updatedAccount });
  } catch (error) {
    res.status(500).json({ error: 'Error depositing into account' });
  }
};

// Withdraw from account
exports.withdraw = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const account = await Accounts.findOne({ _id: id });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    if (amount > account.balance) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    account.balance -= amount;
    account.updatedAt = new Date();

    const updatedAccount = await account.save();
    res.status(200).json({ message: `Withdrew ${amount} from account`, updatedAccount });
  } catch (error) {
    res.status(500).json({ error: 'Error withdrawing from account' });
  }
};

exports.transferFunds = async (req, res) => {
  let { fromAccountId, toAccountId, amount } = req.body;

  try {
    // Validate input
    if (!fromAccountId || !toAccountId || amount == null) {
      return res.status(400).json({ error: 'fromAccountId, toAccountId, and amount are required' });
    }

    // Ensure amount is a number
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    // Find both accounts
    const fromAccount = await Accounts.findOne({ _id: fromAccountId });
    const toAccount = await Accounts.findOne({ _id: toAccountId });

    if (!fromAccount || !toAccount) {
      return res.status(404).json({ error: 'One or both accounts not found' });
    }

    // Convert balance from Decimal128 to JavaScript Number
    const fromBalance = parseFloat(fromAccount.balance.toString());
    const toBalance = parseFloat(toAccount.balance.toString());

    // Check for sufficient balance
    if (amount > fromBalance) {
      return res.status(400).json({ error: 'Insufficient balance in the source account' });
    }

    // Perform the transfer
    const newFromBalance = fromBalance - amount;
    const newToBalance = toBalance + amount;

    // Convert back to Decimal128 for saving to MongoDB
    fromAccount.balance = mongoose.Types.Decimal128.fromString(newFromBalance.toString());
    fromAccount.updatedAt = new Date();
    await fromAccount.save();

    toAccount.balance = mongoose.Types.Decimal128.fromString(newToBalance.toString());
    toAccount.updatedAt = new Date();
    await toAccount.save();

    res.status(200).json({
      message: `Transferred ${amount} from account ${fromAccountId} to account ${toAccountId}`,
      fromAccount,
      toAccount,
    });
  } catch (error) {
    console.error('Error transferring funds:', error);
    res.status(500).json({ error: 'Error transferring funds' });
  }
};

const Income = require('../models/Income'); // Import Income model
// Add a new income record
exports.addIncome = async (req, res) => {
  const { amount, source, category, dateReceived, accountId, isRecurring, frequency, description } = req.body;

  try {
    // Create a new income record
    const income = new Income({
      amount,
      source,
      category,
      dateReceived,
      accountId,
      isRecurring,
      frequency: isRecurring ? frequency : null, // Set frequency only if recurring
      description,
    });
    
    await income.save();

    // Update the account balance using `_id` as the field in the query
    await Accounts.findOneAndUpdate(
      { _id: accountId }, // Using `_id` instead of `accountId`
      { $inc: { balance: amount } }
    );

    res.status(201).json({ message: 'Income added successfully', income });
  } catch (error) {
    console.error('Error adding income:', error);
    res.status(500).json({ error: 'Error adding income' });
  }
};

// Get all income records
exports.getAllIncomes = async (req, res) => {
  try {
    const incomes = await Income.find().populate('accountId'); // Optionally populate account details
    res.status(200).json(incomes);
  } catch (error) {
    console.error('Error fetching incomes:', error);
    res.status(500).json({ error: 'Error fetching incomes' });
  }
};

// Get a single income record by ID
exports.getIncomeById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const income = await Income.findById(id).populate('accountId');
    
    if (!income) {
      return res.status(404).json({ error: 'Income not found' });
    }

    res.status(200).json(income);
  } catch (error) {
    console.error('Error fetching income by ID:', error);
    res.status(500).json({ error: 'Error fetching income' });
  }
};

// Update an income record
exports.updateIncome = async (req, res) => {
  const { id } = req.params;
  const { amount, source, category, dateReceived, accountId, isRecurring, frequency, description } = req.body;

  // Validate income ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid income ID" });
  }

  try {
    const income = await Income.findById(id);

    if (!income) {
      return res.status(404).json({ error: 'Income not found' });
    }

    const oldAmount = income.amount;
    const oldAccountId = income.accountId;  // Save the old account ID

    // Update fields
    income.amount = amount || income.amount;
    income.source = source || income.source;
    income.category = category || income.category;
    income.dateReceived = dateReceived || income.dateReceived;
    income.accountId = accountId || income.accountId;
    income.isRecurring = isRecurring !== undefined ? isRecurring : income.isRecurring;
    income.frequency = isRecurring ? frequency : null; // Set frequency only if recurring
    income.description = description || income.description;
    income.updatedAt = new Date();

    await income.save();

    // Update the account balance if amount or accountId has changed
    if (amount || oldAccountId.toString() !== accountId) {
      const difference = amount ? amount - oldAmount : 0;
      
      // Update old account if it changed
      if (oldAccountId.toString() !== accountId) {
        await Accounts.findByIdAndUpdate(oldAccountId, { $inc: { balance: -oldAmount } });
        await Accounts.findByIdAndUpdate(accountId, { $inc: { balance: amount } });
      } else {
        await Accounts.findByIdAndUpdate(accountId, { $inc: { balance: difference } });
      }
    }

    res.status(200).json({ message: 'Income updated successfully', income });
  } catch (error) {
    console.error('Error updating income:', error);
    res.status(500).json({ error: 'Error updating income' });
  }
};

// Delete an income record
exports.deleteIncome = async (req, res) => {
  const { id } = req.params;

  // Validate income ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid income ID" });
  }

  try {
    const income = await Income.findByIdAndDelete(id);
    
    if (!income) {
      return res.status(404).json({ error: 'Income not found' });
    }

    // Decrement the account balance by the income amount
    await Accounts.findByIdAndUpdate(income.accountId, { $inc: { balance: -income.amount } });

    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error('Error deleting income:', error);
    res.status(500).json({ error: 'Error deleting income' });
  }
};

const Expense = require('../models/Expense'); // Expense model


// Add a new expense
exports.addExpense = async (req, res) => {
  const { amount, category, dateSpent, accountId, isRecurring, frequency, description } = req.body;

  try {
    // Convert amount to a number and check if it's valid
    const expenseAmount = parseFloat(amount);
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      return res.status(400).json({ error: 'Invalid expense amount' });
    }

    // Check if the account exists and has sufficient balance
    const account = await Accounts.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    if (account.balance < expenseAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const expense = new Expense({
      amount: expenseAmount,
      category,
      dateSpent,
      accountId,
      isRecurring,
      frequency: isRecurring ? frequency : null,
      description,
    });

    await expense.save();

    // Update the account balance
    account.balance -= expenseAmount;
    await account.save();

    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (error) {
    console.error('Error adding expense:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error adding expense' });
  }
};

// Get all expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Error fetching expenses' });
  }
};

// Get a single expense by ID
exports.getExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.status(200).json(expense);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ error: 'Error fetching expense' });
  }
};

// Update an expense by ID
exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const { amount, category, dateSpent, accountId, isRecurring, frequency, description } = req.body;

  try {
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const oldAmount = expense.amount;

    // Update fields
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.dateSpent = dateSpent || expense.dateSpent;
    expense.accountId = accountId || expense.accountId;
    expense.isRecurring = isRecurring !== undefined ? isRecurring : expense.isRecurring;
    expense.frequency = isRecurring ? frequency : null;
    expense.description = description || expense.description;
    expense.updatedAt = new Date();

    await expense.save();

    // Update the account balance to reflect the updated expense amount
    if (amount) {
      const difference = oldAmount - amount; // Difference to update balance
      await Accounts.findByIdAndUpdate(accountId, { $inc: { balance: difference } });
    }

    res.status(200).json({ message: 'Expense updated successfully', expense });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Error updating expense' });
  }
};

// Delete an expense by ID
exports.deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Adjust the account balance by adding back the deleted expense amount
    await Accounts.findByIdAndUpdate(expense.accountId, { $inc: { balance: expense.amount } });

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Error deleting expense' });
  }
};




const Transaction = require('../models/Transaction');


exports.createTransaction = async (req, res) => {
  const { amount, type, accountId, category, date, description, transactionRefId } = req.body;

  try {
      // Check if account exists
      const account = await Account.findById(accountId);
      if (!account) return res.status(404).json({ message: 'Account not found' });

      // Check if the referenced income or expense document exists
      const referenceModel = type === 'Income' ? Income : Expense;
      const referenceDoc = await referenceModel.findById(transactionRefId);
      if (!referenceDoc) return res.status(404).json({ message: `${type} reference not found` });

      // Create the transaction
      const transaction = new Transaction({
          amount,
          type,
          accountId,
          category,
          date,
          description,
          transactionRefId
      });

      await transaction.save();
      res.status(201).json(transaction);
  } catch (error) {
      res.status(500).json({ message: 'Failed to create transaction', error });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
      const transactions = await Transaction.find().populate('accountId', 'accountName')
                                                    .populate('transactionRefId');
      res.json(transactions);
  } catch (error) {
      res.status(500).json({ message: 'Failed to fetch transactions', error });
  }
};


exports.getTransactionsByType = async (req, res) => {
  const { type } = req.params;

  try {
      const transactions = await Transaction.find({ type })
                                           .populate('accountId', 'accountName')
                                           .populate('transactionRefId');
      res.json(transactions);
  } catch (error) {
      res.status(500).json({ message: `Failed to fetch ${type} transactions`, error });
  }
};


exports.getTransactionsByAccount = async (req, res) => {
  const { accountId } = req.params;

  try {
      const transactions = await Transaction.find({ accountId })
                                           .populate('transactionRefId')
                                           .populate('accountId', 'accountName');
      res.json(transactions);
  } catch (error) {
      res.status(500).json({ message: 'Failed to fetch transactions for account', error });
  }
};


exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, type, accountId, category, date, description, transactionRefId } = req.body;

  try {
      // Check if the referenced income or expense document exists
      const referenceModel = type === 'Income' ? Income : Expense;
      const referenceDoc = await referenceModel.findById(transactionRefId);
      if (!referenceDoc) return res.status(404).json({ message: `${type} reference not found` });

      // Update the transaction
      const transaction = await Transaction.findByIdAndUpdate(
          id,
          { amount, type, accountId, category, date, description, transactionRefId },
          { new: true }
      ).populate('accountId', 'accountName').populate('transactionRefId');

      if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

      res.json(transaction);
  } catch (error) {
      res.status(500).json({ message: 'Failed to update transaction', error });
  }
};


exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
      const transaction = await Transaction.findByIdAndDelete(id);
      if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

      res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Failed to delete transaction', error });
  }
};

const Analysis = require('../models/analysis');  // Import your Analysis model

// Create a new analysis record
exports.createAnalysis = async (req, res) => {
    try {
        const { userId, liquidBalance, investments, loanDetails } = req.body;

        // Create a new analysis document
        const analysis = new Analysis({
            userId,
            liquidBalance,
            investments,
            loanDetails
        });

        // Save to the database
        await analysis.save();
        res.status(201).json(analysis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get analysis for a specific user
exports.getAnalysisByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const analysis = await Analysis.findOne({ userId }).populate('userId');

        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update analysis record
exports.updateAnalysis = async (req, res) => {
    try {
        const { userId } = req.params;  // Assuming you're updating based on userId
        const updatedData = req.body;

        const analysis = await Analysis.findOneAndUpdate({ userId }, updatedData, {
            new: true,  // Return the updated document
            runValidators: true  // Ensure that validation rules are applied
        });

        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete analysis record
exports.deleteAnalysis = async (req, res) => {
    try {
        const { userId } = req.params;
        const analysis = await Analysis.findOneAndDelete({ userId });

        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }
        res.json({ message: 'Analysis deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMarketPrices = async (req, res) => {
  try {
    // Simulate fetching market prices with dummy data
    const marketPrices = {
      gold: 1800,
      realEstate: 200,
      stocks: {
        SP500: 4000,
        NASDAQ: 13000,
      },
    };

    res.status(200).json(marketPrices);
  } catch (error) {
    console.error("Error fetching market prices:", error);
    res.status(500).json({ message: "Failed to fetch market prices" });
  }
};

const Savings = require('../models/Savings'); // Import the Savings model

// Create a savings goal
exports.createSavings = async (req, res) => {
  // Destructure fields from request body
  const { goalName, targetAmount, savedAmount, priority, startDate, endDate, description } = req.body;

  // Log incoming request data
  console.log('Incoming savings request data:', req.body);

  try {
    // Validate incoming data (add more specific validations as needed)
    if (!goalName || !targetAmount || !priority || !startDate || !endDate) {
      console.log('Validation error: Missing required fields for savings goal');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new savings goal object
    const newSavings = new Savings({
      savingsId: uuidv4(), // Generate unique ID
      goalName,
      targetAmount,
      savedAmount: savedAmount || 0, // Default to 0 if not provided
      priority,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Log savings goal object before saving
    console.log('Savings goal to be saved:', newSavings);

    // Save the new savings goal
    const savedSavings = await newSavings.save();
    console.log('Savings goal saved successfully:', savedSavings); // Log saved goal

    // Send response
    res.status(201).json({
      message: 'Savings goal created successfully',
      savings: savedSavings
    });
  } catch (error) {
    console.error('Error saving savings goal:', error); // Log error details
    res.status(500).json({ error: 'Failed to create savings goal' });
  }
};

// Get a specific savings goal by ID
exports.getSavingsById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch savings goal by ID
    const savingsGoal = await Savings.findById(id);

    if (!savingsGoal) {
      console.log('Savings goal not found:', id);
      return res.status(404).json({ error: 'Savings goal not found' });
    }

    // Send response with found savings goal
    res.status(200).json(savingsGoal);
  } catch (error) {
    console.error('Error retrieving savings goal:', error); // Log error
    res.status(500).json({ error: 'Failed to retrieve savings goal' });
  }
};


exports.getAllSavings = async (req, res) => {
  try {
    // Retrieve all savings goals from the database
    const savings = await Savings.find();

    // Log the retrieved savings goals
    console.log('Retrieved savings goals:', savings);

    // Send response with the list of all savings goals
    res.status(200).json(savings);
  } catch (error) {
    // Log any errors encountered
    console.error('Error retrieving savings goals:', error);
    
    // Send error response
    res.status(500).json({ error: 'Failed to retrieve savings goals' });
  }
};


// Update a savings goal by ID
exports.updateSavings = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Find and update savings goal by ID
    const updatedSavings = await Savings.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedSavings) {
      console.log('Savings goal not found:', id);
      return res.status(404).json({ error: 'Savings goal not found' });
    }

    // Log updated savings goal
    console.log('Savings goal updated successfully:', updatedSavings);

    // Send response with updated savings goal
    res.status(200).json({
      message: 'Savings goal updated successfully',
      savings: updatedSavings
    });
  } catch (error) {
    console.error('Error updating savings goal:', error); // Log error
    res.status(500).json({ error: 'Failed to update savings goal' });
  }
};


// Delete a savings goal by ID
exports.deleteSavings = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete savings goal by ID
    const deletedSavings = await Savings.findByIdAndDelete(id);

    if (!deletedSavings) {
      console.log('Savings goal not found:', id);
      return res.status(404).json({ error: 'Savings goal not found' });
    }

    // Log deletion success
    console.log('Savings goal deleted successfully:', deletedSavings);

    // Send response confirming deletion
    res.status(200).json({
      message: 'Savings goal deleted successfully',
      savings: deletedSavings
    });
  } catch (error) {
    console.error('Error deleting savings goal:', error); // Log error
    res.status(500).json({ error: 'Failed to delete savings goal' });
  }
};











