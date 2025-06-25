'use client'

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Grid,
  useTheme,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MoneyIcon from '@mui/icons-material/Money';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import Header from 'components/Header';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

const API_BASE_URL = 'http://localhost:9000';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(3),
  transition: 'all 0.3s ease',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #2c3e50, #34495e)'
    : 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
  width: '100%',
  maxWidth: '100%',
  margin: '0 auto',
  borderRadius: '12px',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  border: 'none',
  borderRadius: '16px',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, #1a1a2e, #16213e)'
    : 'linear-gradient(135deg, #ffffff, #f0f0f0)',
  color: theme.palette.mode === 'dark' ? 'white' : 'black',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 4px 10px rgba(255, 255, 255, 0.1)'
    : '0 4px 10px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 6px 12px rgba(255, 255, 255, 0.15)'
      : '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
}));

const TransactionArrow = styled(Box)(({ theme, type }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  marginRight: theme.spacing(2),
  backgroundColor: type === 'income' 
    ? theme.palette.success.light 
    : theme.palette.error.light,
  color: theme.palette.common.white,
}));

const ProfessionalButton = styled('button')(({ theme }) => ({
  padding: '10px 20px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  cursor: 'pointer',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    transform: 'translateY(-2px)',
  },
}));

const parseAmount = (value) => {
  if (!value) return 0;
  if (typeof value === 'object' && value.$numberDecimal) {
    return parseFloat(value.$numberDecimal);
  }
  return parseFloat(value);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalLiquidBalance, setTotalLiquidBalance] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactionType, setTransactionType] = useState('all');
  const theme = useTheme();

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [incomesResponse, expensesResponse, accountsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/client/incomes`),
        axios.get(`${API_BASE_URL}/client/expenses`),
        axios.get(`${API_BASE_URL}/client/accounts`)
      ]);

      const incomes = incomesResponse.data.map(income => ({ ...income, type: 'income', date: income.dateReceived }));
      const expenses = expensesResponse.data.map(expense => ({ ...expense, type: 'expense', date: expense.dateSpent }));

      const allTransactions = [...incomes, ...expenses].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );

      setTransactions(allTransactions);
      setFilteredTransactions(allTransactions);

      const liquidAccounts = accountsResponse.data.filter(account => 
        account.accountType === 'savings' || account.accountType === 'checking'
      );
      const totalLiquid = liquidAccounts.reduce((sum, account) => sum + parseAmount(account.balance), 0);

      const totalExp = expenses.reduce((sum, expense) => sum + parseAmount(expense.amount), 0);

      setTotalLiquidBalance(totalLiquid);
      setTotalExpense(totalExp);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    let filtered = transactions;

    if (startDate) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(endDate));
    }
    if (transactionType !== 'all') {
      filtered = filtered.filter(t => t.type === transactionType);
    }

    setFilteredTransactions(filtered);
  }, [transactions, startDate, endDate, transactionType]);
  
  const prepareChartData = () => {
    return filteredTransactions.reduce((acc, transaction) => {
      const category = transaction.category || 'Other';
      const amount = parseAmount(transaction.amount);
  
      const existingCategory = acc.find(item => item.category === category);
      if (existingCategory) {
        if (transaction.type === 'income') existingCategory.Income += amount;
        else existingCategory.Expense += amount;
      } else {
        acc.push({
          category,
          Income: transaction.type === 'income' ? amount : 0,
          Expense: transaction.type === 'expense' ? amount : 0,
        });
      }
      return acc;
    }, []);
  };

  const prepareBubbleChartData = () => {
    const incomeData = [];
    const expenseData = [];

    filteredTransactions.forEach(transaction => {
      const amount = parseAmount(transaction.amount);
      const date = new Date(transaction.date);
      const dataPoint = {
        x: date.getTime(),
        y: amount,
        z: amount,
        name: transaction.description || transaction.category,
        category: transaction.category || 'Other',
      };

      if (transaction.type === 'income') {
        incomeData.push(dataPoint);
      } else {
        expenseData.push(dataPoint);
      }
    });

    return { incomeData, expenseData };
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  
  const chartData = prepareChartData();
  const bubbleChartData = prepareBubbleChartData();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
      <Header title="Transactions" subtitle="Track it, understand it, control it." />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledCard elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MoneyIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 1 }} />
                  <Typography variant="h6">Total Liquid Balance</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(totalLiquidBalance)}
                </Typography>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledCard elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MoneyIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 1 }} />
                  <Typography variant="h6" >Total Expense</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(totalExpense)}
                </Typography>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card sx={{ 
              backgroundColor: theme => theme.palette.mode === 'dark' ? '#2a2a3b' : '#f9f9f9',
              borderRadius: 3,
              boxShadow: theme => theme.palette.mode === 'dark' 
                ? '0 4px 10px rgba(0, 0, 0, 0.4)'
                : '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}>
              <CardContent>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2, 
                    color: theme => theme.palette.mode === 'dark' ? '#e0e0e0' : '#333'
                  }}
                >
                  Incomings and Outgoings
                </Typography>
                <Box sx={{ height: 300, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="Income"
                        stroke={theme.palette.mode === "dark" ? "#76A9FA" : "#304FFE"}
                        fill={theme.palette.mode === "dark" ? "rgba(118, 169, 250, 0.3)" : "rgba(48, 79, 254, 0.1)"}
                        strokeWidth={2}
                        dot={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="Expense"
                        stroke={theme.palette.mode === "dark" ? "#E57373" : "#D32F2F"}
                        fill={theme.palette.mode === "dark" ? "rgba(229, 115, 115, 0.3)" : "rgba(211, 47, 47, 0.1)"}
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card sx={{ 
              backgroundColor: theme => theme.palette.mode === 'dark' ? '#2a2a3b' : '#f9f9f9',
              borderRadius: 3,
              boxShadow: theme => theme.palette.mode === 'dark'
                ? '0 4px 10px rgba(0, 0, 0, 0.4)'
                : '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    color: theme => theme.palette.mode === 'dark' ? '#e0e0e0' : '#333'
                  }}
                >
                  Income and Expense Analysis
                </Typography>
                <Box sx={{ height: 300, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                    >
                      <CartesianGrid />
                      <XAxis
                        type="number"
                        dataKey="x"
                        name="Date"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
                      />
                      <YAxis type="number" dataKey="y" name="Amount" tickFormatter={(value) => `$${value}`} />
                      <ZAxis type="number" dataKey="z" range={[50, 1000]} name="Amount" />
                      <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        formatter={(value, name, props) => {
                          if (name === 'Date') return new Date(value).toLocaleDateString();
                          if (name === 'Amount') return formatCurrency(value);
                          return value;
                        }}
                      />
                      <Legend />
                      <Scatter
                        name="Income"
                        data={bubbleChartData.incomeData}
                        fill="#4CAF50"
                        shape="circle"
                      />
                      <Scatter
                        name="Expense"
                        data={bubbleChartData.expenseData}
                        fill="#F44336"
                        shape="circle"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Transaction History</Typography>
        <ProfessionalButton>
          See all transactions
        </ProfessionalButton>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Transaction Type</InputLabel>
            <Select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              label="Transaction Type"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Card sx={{ 
        borderRadius: '20px', 
        overflow: 'hidden',
        background: theme.palette.mode === 'dark'
          ? '#2a2a3b'
          : '#f5f7fa',
        boxShadow: theme => theme.palette.mode === 'dark' 
          ? '0 4px 20px rgba(255, 255, 255, 0.1)'
          : '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}>
        <List sx={{ p: 2 }}>
          {filteredTransactions.map((transaction) => (
            <StyledListItem key={transaction._id}>
              <TransactionArrow type={transaction.type}>
                {transaction.type === 'income' ? (
                  <ArrowUpward fontSize="small" />
                ) : (
                  <ArrowDownward fontSize="small" />
                )}
              </TransactionArrow>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    {transaction.description || transaction.category}
                  </Typography>
                }
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2" color="text.secondary">
                      {formatDate(transaction.date)}
                    </Typography>
                  </React.Fragment>
                }
              />
              <ListItemSecondaryAction>
                <Typography
                  variant="subtitle1"
                  color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                  sx={{ fontWeight: 'medium' }}
                >
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(parseAmount(transaction.amount))}
                </Typography>
              </ListItemSecondaryAction>
            </StyledListItem>
          ))}
        </List>
      </Card>
    </Box>
  );
}