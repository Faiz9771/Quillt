'use client'

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Chip,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  styled,
  useTheme,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import Header from 'components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentsIcon from '@mui/icons-material/PaymentsOutlined';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F3A712'];
const BASE_URL = 'http://localhost:9000';

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

const ProfessionalButton = styled(Button)(({ theme }) => ({
  padding: '10px 20px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    transform: 'translateY(-2px)',
  },
}));

const EnhancedCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#2a2a3b' : '#f9f9f9',
  borderRadius: '16px',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
    : '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 12px 48px 0 rgba(0, 0, 0, 0.5)'
      : '0 12px 48px 0 rgba(31, 38, 135, 0.3)',
  },
}));

const SideBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(41, 41, 61, 0.8)' : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
    : '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
}));

const Analysis = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [netWorth, setNetWorth] = useState(0);
  const [liquidBalance, setLiquidBalance] = useState(0);
  const [investments, setInvestments] = useState([]);
  const [loanDetails, setLoanDetails] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [assetCategories, setAssetCategories] = useState({});
  const [annualTaxLiability, setAnnualTaxLiability] = useState(0);
  const [openLoanDialog, setOpenLoanDialog] = useState(false);
  const [loanTenure, setLoanTenure] = useState('');
  const [essentialCategories, setEssentialCategories] = useState(() => {
    const saved = localStorage.getItem('essentialCategories');
    return saved ? JSON.parse(saved) : ['food', 'housing', 'utilities'];
  });
  const [taxRate, setTaxRate] = useState(() => {
    const saved = localStorage.getItem('taxRate');
    return saved ? parseFloat(saved) : 0.25;
  });
  const [tempTaxRate, setTempTaxRate] = useState(taxRate);
  const [openTaxRateDialog, setOpenTaxRateDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [investmentCategories, setInvestmentCategories] = useState(() => {
    const saved = localStorage.getItem('investmentCategories');
    return saved ? JSON.parse(saved) : {
      Gold: 0,
      Stocks: 0,
      'Mutual Funds': 0,
      'Real Estate': 0
    };
  });
  const [openInvestmentDialog, setOpenInvestmentDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [totalInvestmentAmount, setTotalInvestmentAmount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [accountsResponse, expensesResponse] = await Promise.all([
        axios.get(`${BASE_URL}/client/accounts`),
        axios.get(`${BASE_URL}/client/expenses`),
      ]);

      let liquidBalance = 0;
      let totalInvestment = 0;
      let loan = null;
      let totalLiabilities = 0;

      const processedInvestments = accountsResponse.data
        .filter(account => account.accountType === 'investment')
        .map(account => ({
          ...account,
          balance: parseFloat(account.balance.$numberDecimal || account.balance),
          interestRate: parseFloat(account.interestRate.$numberDecimal || account.interestRate) || 0.05,
        }));

      accountsResponse.data.forEach(account => {
        const balance = parseFloat(account.balance.$numberDecimal || account.balance);
        if (account.accountType === 'savings' || account.accountType === 'checking') {
          liquidBalance += balance;
        } else if (account.accountType === 'investment') {
          totalInvestment += balance;
        } else if (account.accountType === 'loan') {
          loan = {
            totalLoan: balance,
            interestRate: parseFloat(account.interestRate.$numberDecimal || account.interestRate),
            loanTerm: parseInt(localStorage.getItem('loanTenure')) || account.loanTerm || 60,
          };
          totalLiabilities += balance;
        }
      });

      setLiquidBalance(liquidBalance);
      setInvestments(processedInvestments);
      setTotalInvestmentAmount(totalInvestment);

      const totalAssets = liquidBalance + totalInvestment;
      const calculatedNetWorth = totalAssets - totalLiabilities;
      setNetWorth(calculatedNetWorth);

      setAssetCategories({
        cash: liquidBalance,
        investments: totalInvestment,
      });

      if (loan) {
        setLoanDetails({
          ...loan,
          emi: calculateEMI(loan.totalLoan, loan.interestRate, loan.loanTerm)
        });
      }

      const processedExpenses = expensesResponse.data.map(expense => ({
        ...expense,
        amount: parseFloat(expense.amount.$numberDecimal || expense.amount)
      }));
      setExpenses(processedExpenses);

      const annualIncome = processedExpenses.reduce((sum, expense) => sum + expense.amount, 0) * 12;
      setAnnualTaxLiability(annualIncome * taxRate);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('An error occurred while fetching data. Please try again later.');
      setLoading(false);
    }
  }, [taxRate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    localStorage.setItem('essentialCategories', JSON.stringify(essentialCategories));
  }, [essentialCategories]);

  useEffect(() => {
    localStorage.setItem('investmentCategories', JSON.stringify(investmentCategories));
  }, [investmentCategories]);

  const calculateEMI = (principal, rate, time) => {
    const r = rate / (12 * 100);
    const t = time;
    return (principal * r * Math.pow(1 + r, t)) / (Math.pow(1 + r, t) - 1);
  };

  const handleUpdateLoanDetails = () => {
    if (loanTenure) {
      const newTenure = parseInt(loanTenure);
      setLoanDetails(prev => ({
        ...prev,
        loanTerm: newTenure,
        emi: calculateEMI(prev.totalLoan, prev.interestRate, newTenure)
      }));
      setOpenLoanDialog(false);
      localStorage.setItem('loanTenure', loanTenure);
      setSnackbar({ open: true, message: 'Loan tenure updated successfully', severity: 'success' });
    }
  };

  const handleUpdateTaxRate = () => {
    setTaxRate(tempTaxRate);
    const annualIncome = expenses.reduce((sum, expense) => sum + expense.amount, 0) * 12;
    const newAnnualTaxLiability = annualIncome * tempTaxRate;
    setAnnualTaxLiability(newAnnualTaxLiability);
    localStorage.setItem('taxRate', tempTaxRate.toString());
    setOpenTaxRateDialog(false);
    setSnackbar({ open: true, message: 'Tax rate updated successfully', severity: 'success' });
    fetchData();
  };

  const toggleEssentialCategory = (category) => {
    setEssentialCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleUpdateInvestment = () => {
    if (selectedCategory && investmentAmount) {
      const newAmount = parseFloat(investmentAmount);
      const currentTotal = Object.values(investmentCategories).reduce((sum, amount) => sum + amount, 0);
      const newTotal = currentTotal - investmentCategories[selectedCategory] + newAmount;

      if (newTotal <= totalInvestmentAmount) {
        setInvestmentCategories(prev => ({
          ...prev,
          [selectedCategory]: newAmount
        }));
        setOpenInvestmentDialog(false);
        setSnackbar({ open: true, message: 'Investment updated successfully', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Total investments cannot exceed the available amount', severity: 'error' });
      }
    }
  };

  const expensePieChartData = [
    { name: 'Essential', value: expenses.filter(exp => essentialCategories.includes(exp.category)).reduce((sum, exp) => sum + exp.amount, 0) },
    { name: 'Non-Essential', value: expenses.filter(exp => !essentialCategories.includes(exp.category)).reduce((sum, exp) => sum + exp.amount, 0) },
  ];

  const assetCategoriesPieChartData = Object.entries(assetCategories).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const investmentPieChartData = Object.entries(investmentCategories).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 4 }}>
      <Header title="ANALYSIS" subtitle="Discover patterns, elevate outcomes." />

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledCard elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PaymentsIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 1 }} /> 
                  <Typography variant="h6" >Net Worth</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  ${netWorth.toFixed(2)}
                </Typography>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledCard elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WaterDropIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 1 }}  /> 
                  <Typography variant="h6" >Liquid Balance</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  ${liquidBalance.toFixed(2)}
                </Typography>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledCard elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShowChartIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 1 }}  /> 
                  <Typography variant="h6" >Total Investment</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  ${totalInvestmentAmount.toFixed(2)}
                </Typography>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledCard elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PriceCheckIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 1 }}  /> 
                  <Typography variant="h6" >Estimated Annual Tax</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  ${annualTaxLiability.toFixed(2)}
                </Typography>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={9}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <EnhancedCard>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: theme => theme.palette.mode === 'dark' ? '#e0e0e0' : '#333'}}>
                      Asset Categories
                    </Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={assetCategoriesPieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {assetCategoriesPieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </EnhancedCard>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <EnhancedCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Expense Breakdown</Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={expensePieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {expensePieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </EnhancedCard>
              </motion.div>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Set Essential Categories</Typography>
            {expenses.map(expense => (
              <Chip
                key={expense.category}
                label={expense.category}
                onClick={() => toggleEssentialCategory(expense.category)}
                color={essentialCategories.includes(expense.category) ? 'primary' : 'default'}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <EnhancedCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Investment Breakdown</Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={investmentPieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {investmentPieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </EnhancedCard>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <EnhancedCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CreditScoreIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 1 }}  /> 
                      <Typography variant="h6" >Loan Details</Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Total Loan: ${loanDetails.totalLoan?.toFixed(2)}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Interest Rate: {loanDetails.interestRate?.toFixed(2)}%</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Loan Term: {loanDetails.loanTerm} months</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>EMI: ${loanDetails.emi?.toFixed(2)}</Typography>
                  </CardContent>
                </EnhancedCard>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <EnhancedCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalanceIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 1 }}  /> 
                  <Typography variant="h6">Investment Categories</Typography>
                </Box>
                {Object.entries(investmentCategories).map(([category, amount]) => (
                  <Typography key={category} variant="body1" sx={{ mb: 1 }}>
                    <strong>{category}:</strong> ${amount.toFixed(2)}
                  </Typography>
                ))}
              </CardContent>
            </EnhancedCard>
          </motion.div>
          <SideBox sx={{ mt: 2 }}>
            <ProfessionalButton
              variant="contained"
              onClick={() => setOpenTaxRateDialog(true)}
              startIcon={<PriceCheckIcon />}
            >
              Update Tax Rate
            </ProfessionalButton>
            <ProfessionalButton
              variant="contained"
              onClick={() => setOpenLoanDialog(true)}
              startIcon={<CreditScoreIcon />}
            >
              Update Loan Details
            </ProfessionalButton>
            <ProfessionalButton
              variant="contained"
              onClick={() => setOpenInvestmentDialog(true)}
              startIcon={<AccountBalanceIcon />}
            >
              Update Investments
            </ProfessionalButton>
          </SideBox>
        </Grid>
      </Grid>

      <Dialog open={openLoanDialog} onClose={() => setOpenLoanDialog(false)}>
        <DialogTitle>Update Loan Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Loan Tenure (in months)"
            type="number"
            value={loanTenure}
            onChange={(e) => setLoanTenure(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLoanDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateLoanDetails}>Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openTaxRateDialog} onClose={() => setOpenTaxRateDialog(false)}>
        <DialogTitle>Update Tax Rate</DialogTitle>
        <DialogContent>
          <TextField
            label="Tax Rate (%)"
            type="number"
            value={tempTaxRate * 100}
            onChange={(e) => setTempTaxRate(parseFloat(e.target.value) / 100)}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTaxRateDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateTaxRate}>Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openInvestmentDialog} onClose={() => setOpenInvestmentDialog(false)}>
        <DialogTitle>Update Investment</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {Object.keys(investmentCategories).map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Amount"
            type="number"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInvestmentDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateInvestment}>Update</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Analysis;