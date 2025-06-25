"use client"

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Header from 'components/Header';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function to safely parse numeric values
const parseAmount = (value: any): number => {
  if (!value) return 0;
  
  // Handle MongoDB Decimal128 type
  if (typeof value === 'object' && value.$numberDecimal) {
    return parseFloat(value.$numberDecimal);
  }
  
  // Handle regular number or string
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Helper function to format dates
const formatDate = (dateString: string): string => {
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

// Income categories and sources
const categories = ['Salary', 'Freelance', 'Business Income', 'Dividends', 'Interest', 'Rental Income', 'Royalties', 'Gifts', 'Pensions', 'Social Security', 'Grants', 'Side Gigs', 'Consulting', 'Affiliate Marketing', 'Online Content', 'Other'];
const sources = ['Job', 'Rental Income', 'Dividends', 'Gifts', 'Other'];

const StyledForm = styled(motion.form)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
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

const SidebarBox = styled(motion.div)(({ theme }) => ({
  width: '300px',
  padding: theme.spacing(3),
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, #1a1a2e, #16213e)'
    : 'linear-gradient(135deg, #ffffff, #f0f0f0)',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const TotalCard = styled(motion(Card))(({ theme }) => ({
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

const IncomeCard = styled(motion(ListItem))(({ theme }) => ({
  border: 'none',
  borderRadius: theme.shape.borderRadius,
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
    transform: 'translateY(-5px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 16px rgba(255, 255, 255, 0.2)'
      : '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const AddIncomeForm = ({ onAdd, accounts, onClose }) => {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const [dateReceived, setDateReceived] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const clearForm = () => {
    setAmount('');
    setSource('');
    setCategory('');
    setDateReceived(new Date().toISOString().split('T')[0]);
    setDescription('');
    setAccountId('');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!amount || !source || !category || !accountId) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      await onAdd({ amount, source, category, dateReceived, description, accountId });
      clearForm();
      onClose();
    } catch (error) {
      console.error('Error adding income:', error);
      setErrorMessage('Failed to add income. Please try again.');
    }
  };

  return (
    <StyledForm
      component="form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>Add New Income</Typography>
      {errorMessage && <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>}
      
      <TextField label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      <FormControl fullWidth required>
        <InputLabel>Source</InputLabel>
        <Select value={source} onChange={(e) => setSource(e.target.value)}>
          {sources.map((sourceOption) => (
            <MenuItem key={sourceOption} value={sourceOption}>{sourceOption}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth required>
        <InputLabel>Category</InputLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((categoryOption) => (
            <MenuItem key={categoryOption} value={categoryOption}>{categoryOption}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField label="Date Received" type="date" value={dateReceived} onChange={(e) => setDateReceived(e.target.value)} required />
      <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <FormControl fullWidth required>
        <InputLabel>Account</InputLabel>
        <Select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
          <MenuItem value=""><em>None</em></MenuItem>
          {accounts.map((account) => (
            <MenuItem key={account._id} value={account._id}>
              {`${account.accountName} (**** ${account._id.slice(-4)})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ProfessionalButton type="submit" variant="contained" color="primary">Add Income</ProfessionalButton>
      <ProfessionalButton onClick={onClose} variant="outlined">Cancel</ProfessionalButton>
    </StyledForm>
  );
};

const UpdateIncomeForm = ({ income, onUpdate, accounts, onClose }) => {
  const [amount, setAmount] = useState(income.amount || '');
  const [source, setSource] = useState(income.source || '');
  const [category, setCategory] = useState(income.category || '');
  const [dateReceived, setDateReceived] = useState(income.dateReceived ? new Date(income.dateReceived).toISOString().split('T')[0] : '');
  const [description, setDescription] = useState(income.description || '');
  const [accountId, setAccountId] = useState(income.accountId || '');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!amount || !source || !category || !accountId) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      await onUpdate({ ...income, amount, source, category, dateReceived, description, accountId });
      onClose();
    } catch (error) {
      console.error('Error updating income:', error);
      setErrorMessage('Failed to update income. Please try again.');
    }
  };

  return (
    <StyledForm
      component="form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>Update Income</Typography>
      {errorMessage && <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>}
      
      <TextField label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      <FormControl fullWidth required>
        <InputLabel>Source</InputLabel>
        <Select value={source} onChange={(e) => setSource(e.target.value)}>
          {sources.map((sourceOption) => (
            <MenuItem key={sourceOption} value={sourceOption}>{sourceOption}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth required>
        <InputLabel>Category</InputLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((categoryOption) => (
            <MenuItem key={categoryOption} value={categoryOption}>{categoryOption}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField label="Date Received" type="date" value={dateReceived} onChange={(e) => setDateReceived(e.target.value)} required />
      <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <FormControl fullWidth required>
        <InputLabel>Account</InputLabel>
        <Select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
          <MenuItem value=""><em>None</em></MenuItem>
          {accounts.map((account) => (
            <MenuItem key={account._id} value={account._id}>
              {`${account.accountName} (**** ${account._id.slice(-4)})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ProfessionalButton type="submit" variant="contained" color="primary">Update Income</ProfessionalButton>
      <ProfessionalButton onClick={onClose} variant="outlined">Cancel</ProfessionalButton>
    </StyledForm>
  );
};

const DeleteIncomeDialog = ({ open, onClose, onConfirm }) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperComponent={motion.div}
    PaperProps={{
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
      transition: { duration: 0.3 },
    }}
  >
    <DialogTitle>Delete Income</DialogTitle>
    <DialogContent>
      <DialogContentText>Are you sure you want to delete this income record?</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="secondary">Cancel</Button>
      <Button onClick={onConfirm} color="error">Delete</Button>
    </DialogActions>
  </Dialog>
);

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [showAddIncomeForm, setShowAddIncomeForm] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pieChartData, setPieChartData] = useState([]);

  const theme = useTheme();

  const fetchIncomes = useCallback(async () => {
    
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get('http://localhost:9000/client/incomes');
      setIncomes(data);
    } catch (error) {
      console.error('Error fetching incomes:', error);
      setError('Failed to fetch incomes');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAccounts = useCallback(async () => {
    try {
      const { data } = await axios.get('http://localhost:9000/client/accounts');
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError('Failed to fetch accounts');
    }
  }, []);

  const preparePieChartData = useCallback(() => {
    const categoryTotals = incomes.reduce((acc, income) => {
      const amount = parseAmount(income.amount);
      acc[income.category] = (acc[income.category] || 0) + amount;
      return acc;
    }, {});

    const data = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
    setPieChartData(data);
  }, [incomes]);

  useEffect(() => {
    fetchIncomes();
    fetchAccounts();
  }, [fetchIncomes, fetchAccounts]);

  useEffect(() => {
    preparePieChartData();
  }, [incomes, preparePieChartData]);

  const handleAddIncome = async (newIncome) => {
    try {
      await axios.post('http://localhost:9000/client/incomes', newIncome);
      await fetchIncomes();
      await fetchAccounts();
      setShowAddIncomeForm(false);
    } catch (error) {
      console.error('Error adding income:', error);
      throw error;
    }
  };

  const handleUpdateIncome = async (updatedIncome) => {
    try {
      await axios.put(`http://localhost:9000/client/incomes/${updatedIncome._id}`, updatedIncome);
      await fetchIncomes();
      await fetchAccounts();
      setShowUpdateForm(false);
      setSelectedIncome(null);
    } catch (error) {
      console.error('Error updating income:', error);
      throw error;
    }
  };

  const handleDeleteIncome = async () => {
    if (selectedIncome) {
      try {
        await axios.delete(`http://localhost:9000/client/incomes/${selectedIncome._id}`);
        await fetchIncomes();
        await fetchAccounts();
        setDeleteDialogOpen(false);
        setSelectedIncome(null);
      } catch (error) {
        console.error('Error deleting income:', error);
        setError('Failed to delete income');
      }
    }
  };

  const totalLiquidBalance = accounts
    .filter(account => account.accountType === 'savings' || account.accountType === 'checking')
    .reduce((total, account) => total + parseAmount(account.balance), 0);

  const totalInvestmentsBalance = accounts
    .filter(account => account.accountType === 'investment')
    .reduce((total, account) => total + parseAmount(account.balance), 0);

  const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#5DADE2'
  ];

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
      <Header title="INCOME" subtitle="Track your earnings and investments." />
      
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <TotalCard elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AttachMoneyIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 1 }} />
                      <Typography variant="h6">Total Liquid Balance</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(totalLiquidBalance)}
                    </Typography>
                  </CardContent>
                </TotalCard>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <TotalCard elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccountBalanceIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 1 }} />
                      <Typography variant="h6">Total Investments Balance</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(totalInvestmentsBalance)}
                    </Typography>
                  </CardContent>
                </TotalCard>
              </motion.div>
            </Grid>
          </Grid>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card sx={{ 
              mb: 4, 
              backgroundColor: theme => theme.palette.mode === 'dark' ? '#2a2a3b' : '#f9f9f9', // Dark for dark mode, light for light mode
              borderRadius: 3,
              boxShadow: theme => theme.palette.mode === 'dark' 
                ? '0 4px 10px rgba(0, 0, 0, 0.4)'  // Dark shadow for dark mode
                : '0 4px 10px rgba(0, 0, 0, 0.1)', // Soft shadow for light mode
            }}>
              <CardContent>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2, 
                    color: theme => theme.palette.mode === 'dark' ? '#e0e0e0' : '#333' // Light gray for dark mode, dark gray for light mode
                  }}
                >
                  Income Categories
                </Typography>
                <Box sx={{ height: 250, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60} // Inner radius for donut style
                      outerRadius={90} // Outer radius for a bit of prominence
                      labelLine={false}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          stroke="none" // Clean look with no borders
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)} 
                      contentStyle={{ 
                        backgroundColor: theme => theme.palette.mode === 'dark' ? '#1b1b1b' : '#fff', // Darker background for dark mode
                        borderRadius: '8px', 
                        color: theme => theme.palette.mode === 'dark' ? '#e0e0e0' : '#333', // Light gray text for dark mode
                        border: theme => theme.palette.mode === 'dark' ? '1px solid #333' : 'none', // Subtle border for dark mode
                        boxShadow: theme => theme.palette.mode === 'dark' ? '0px 4px 10px rgba(255, 255, 255, 0.1)' : '0px 4px 10px rgba(0, 0, 0, 0.1)' // Soft shadow
                      }}
                    />

                    <Legend 
                      layout="vertical" 
                      align="right" 
                      verticalAlign="middle" 
                      iconType="circle" 
                      wrapperStyle={{ paddingLeft: '10px' }}
                    />
                </PieChart>

                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>



          </motion.div>

          <Typography variant="h5" sx={{ mb: 2 }}>Income Records</Typography>
          <List>
            <AnimatePresence>
              {incomes.map((income, index) => (
                <motion.div
                  key={income._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <IncomeCard>
                    <ListItemText
                      primary={
                        <Typography variant="h6">
                          {income.source} - {formatCurrency(parseAmount(income.amount))}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(income.dateReceived)} | {income.category}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        aria-label="edit"
                        onClick={() => { setSelectedIncome(income); setShowUpdateForm(true); }}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => { setSelectedIncome(income); setDeleteDialogOpen(true); }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </IncomeCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>

          <AnimatePresence>
            {showAddIncomeForm && (
              <AddIncomeForm accounts={accounts} onAdd={handleAddIncome} onClose={() => setShowAddIncomeForm(false)} />
            )}

            {showUpdateForm && selectedIncome && (
              <UpdateIncomeForm income={selectedIncome} accounts={accounts} onUpdate={handleUpdateIncome} onClose={() => setShowUpdateForm(false)} />
            )}
          </AnimatePresence>
        </Box>

        <SidebarBox
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>Income Management</Typography>
          <ProfessionalButton
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowAddIncomeForm(!showAddIncomeForm)}
            fullWidth
          >
            {showAddIncomeForm ? 'Cancel' : 'Add New Income'}
          </ProfessionalButton>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Income to Manage</InputLabel>
            <Select
              value={selectedIncome ? selectedIncome._id : ''}
              onChange={(e) => {
                const incomeId = e.target.value;
                const incomeToManage = incomes.find(inc => inc._id === incomeId);
                setSelectedIncome(incomeToManage);
                setShowUpdateForm(!!incomeToManage);
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {incomes.map((income) => (
                <MenuItem key={income._id} value={income._id}>
                  {`${income.source} - ${formatCurrency(parseAmount(income.amount))}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <AnimatePresence>
            {selectedIncome && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <ProfessionalButton
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setShowUpdateForm(false);
                      setSelectedIncome(null);
                    }}
                    fullWidth
                  >
                    Cancel Selection
                  </ProfessionalButton>
                  <ProfessionalButton
                    variant="contained"
                    color="error"
                    onClick={() => {
                      setDeleteDialogOpen(true);
                    }}
                    fullWidth
                  >
                    Delete Income
                  </ProfessionalButton>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </SidebarBox>
      </Box>

      <DeleteIncomeDialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)} 
        onConfirm={handleDeleteIncome} 
      />
    </Box>
  );
};

export default Income;