'use client'

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
  Snackbar,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SavingsIcon from '@mui/icons-material/Savings';
import Header from 'components/Header';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';

const StyledCard = styled(motion(Card))(({ theme }) => ({
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

const SavingsGoalItem = styled(motion(ListItem))(({ theme }) => ({
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

const PiggyBankProgress = ({ value }) => (
  <Box
    sx={{
      position: 'relative',
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      backgroundColor: value >= 100 ? '#FFC107' : '#FFC1C1',  // Cheerful yellow or sad pink
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    }}
  >
    {/* Happy Piggy Bank */}
    {value >= 100 && (
      <>
        <Box className="coin" sx={{
          position: 'absolute',
          top: '-20px',
          animation: 'dropCoin 1s infinite',
          '@keyframes dropCoin': {
            '0%': { transform: 'translateY(-20px) scale(1)' },
            '50%': { transform: 'translateY(20px) scale(1.2)' },
            '100%': { transform: 'translateY(0) scale(1)' },
          },
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#FFD700',
        }} />
        <Box className="eye" sx={{ position: 'absolute', top: '40%', left: '30%', width: '10px', height: '10px', backgroundColor: '#333', borderRadius: '50%' }} />
        <Box className="eye" sx={{ position: 'absolute', top: '40%', right: '30%', width: '10px', height: '10px', backgroundColor: '#333', borderRadius: '50%' }} />
      </>
    )}

    {/* Sad Piggy Bank */}
    {value < 100 && (
      <>
        <Box className="tear" sx={{
          position: 'absolute',
          bottom: '20%',
          left: '40%',
          width: '8px',
          height: '20px',
          backgroundColor: '#5DADE2',
          borderRadius: '50%',
          animation: 'tearDrop 1.5s infinite',
          '@keyframes tearDrop': {
            '0%': { transform: 'translateY(0)', opacity: 1 },
            '100%': { transform: 'translateY(15px)', opacity: 0 },
          },
        }} />
        <Box className="eye-sad" sx={{ position: 'absolute', top: '40%', left: '30%', width: '10px', height: '10px', backgroundColor: '#333', borderRadius: '50%' }} />
        <Box className="eye-sad" sx={{ position: 'absolute', top: '40%', right: '30%', width: '10px', height: '10px', backgroundColor: '#333', borderRadius: '50%' }} />
      </>
    )}
  </Box>
);



const parseAmount = (value) => {
  if (typeof value === 'object' && value !== null && '$numberDecimal' in value) {
    return parseFloat(value.$numberDecimal);
  }
  return parseFloat(value) || 0;
};

const formatCurrency = (amount) => {
  const parsedAmount = parseAmount(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsedAmount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const SavingsGoalForm = ({ goal, onSubmit, onClose }) => {
  const [goalName, setGoalName] = useState(goal ? goal.goalName : '');
  const [targetAmount, setTargetAmount] = useState(goal ? parseAmount(goal.targetAmount).toString() : '');
  const [startDate, setStartDate] = useState(goal ? goal.startDate.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(goal ? goal.endDate.split('T')[0] : '');
  const [priority, setPriority] = useState(goal ? goal.priority : 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      goalName,
      targetAmount: parseFloat(targetAmount),
      startDate,
      endDate,
      priority: parseInt(priority),
      savedAmount: goal ? parseAmount(goal.savedAmount) : 0,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Goal Name"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Target Amount"
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
            inputProps={{ min: "0", step: "0.01" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Priority"
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
            inputProps={{ min: "1", max: "5", step: "1" }}
          />
        </Grid>
        <Grid item xs={12}>
          <ProfessionalButton type="submit" variant="contained" color="primary" fullWidth>
            {goal ? 'Update Savings Goal' : 'Add Savings Goal'}
          </ProfessionalButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default function Component() {
  const theme = useTheme();
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [monthlyExpenseGoal, setMonthlyExpenseGoal] = useState(0);
  const [dailyExpenses, setDailyExpenses] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [totalSaved, setTotalSaved] = useState(0);
  const [dailySavings, setDailySavings] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const fetchSavingsGoals = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:9000/client/savings');
      setSavingsGoals(response.data);
    } catch (err) {
      console.error('Error fetching savings goals:', err);
      setError('Failed to fetch savings goals');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchExpenseData = useCallback(() => {
    const storedMonthlyGoal = localStorage.getItem('monthlyGoal');
    const today = new Date().toISOString().split('T')[0];
    const storedDailyExpense = parseFloat(localStorage.getItem(`dailyExpense_${today}`)) || 0;
    
    if (storedMonthlyGoal) {
      setMonthlyExpenseGoal(parseFloat(storedMonthlyGoal));
      setDailyExpenses(storedDailyExpense);
    } else {
      setError('Failed to fetch expense data from local storage');
    }
  }, []);

  const calculateDailySavings = useCallback(() => {
    const dailyGoal = monthlyExpenseGoal / 30; // Assuming 30 days in a month for simplicity
    const calculatedDailySavings = Math.max(0, dailyGoal - dailyExpenses);
    setDailySavings(calculatedDailySavings);
    return calculatedDailySavings;
  }, [monthlyExpenseGoal, dailyExpenses]);

  const updateTotalSaved = useCallback(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    let accumulatedSavings = 0;

    for (let day = 1; day <= today.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = date.toISOString().split('T')[0];
      const dailyExpense = parseFloat(localStorage.getItem(`dailyExpense_${dateString}`)) || 0;
      const dailyGoal = monthlyExpenseGoal / 30; // Assuming 30 days in a month for simplicity
      const dailySavings = Math.max(0, dailyGoal - dailyExpense);
      accumulatedSavings += dailySavings;
    }

    setTotalSaved(accumulatedSavings);
    localStorage.setItem('totalSaved', accumulatedSavings.toString());
    return accumulatedSavings;
  }, [monthlyExpenseGoal]);

  const resetDailySavings = useCallback(() => {
    const today = new Date().toDateString();
    const lastResetDate = localStorage.getItem('lastResetDate');

    if (lastResetDate !== today) {
      setDailySavings(0);
      localStorage.setItem('lastResetDate', today);
    }
  }, []);

  const updateSavingsGoals = useCallback((accumulatedSavings) => {
    setSavingsGoals(prevGoals => {
      // Sort goals by priority (lowest to highest) and end date
      const sortedGoals = [...prevGoals].sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        return new Date(a.endDate) - new Date(b.endDate);
      });
      
      let remainingSavings = accumulatedSavings;

      const updatedGoals = sortedGoals.map(goal => {
        const targetAmount = parseAmount(goal.targetAmount);
        const currentSavedAmount = parseAmount(goal.savedAmount);
        const amountNeeded = targetAmount - currentSavedAmount;

        if (remainingSavings > 0 && amountNeeded > 0) {
          const amountToAdd = Math.min(remainingSavings, amountNeeded);
          remainingSavings -= amountToAdd;
          const newSavedAmount = currentSavedAmount + amountToAdd;
          const progress = (newSavedAmount / targetAmount) * 100;

          if (newSavedAmount >= targetAmount && currentSavedAmount < targetAmount) {
            setSnackbarMessage(`Congratulations! You've reached your savings goal: ${goal.goalName}`);
            setSnackbarOpen(true);
          }

          return { ...goal, savedAmount: newSavedAmount, progress };
        }

        return goal;
      });

      // Update goals in the database
      updatedGoals.forEach(async (goal) => {
        try {
          await axios.put(`http://localhost:9000/client/savings/${goal._id}`, goal);
        } catch (err) {
          console.error('Error updating savings goal:', err);
        }
      });

      return updatedGoals;
    });
  }, []);

  const prepareChartData = useCallback(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const dailyGoal = monthlyExpenseGoal / daysInMonth;
    let accumulatedSavings = 0;
    
    const data = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(currentYear, currentMonth, i + 1);
      const dateString = date.toISOString().split('T')[0];
      const dailyExpense = parseFloat(localStorage.getItem(`dailyExpense_${dateString}`)) || 0;
      const dailySavings = Math.max(0, dailyGoal - dailyExpense);
      accumulatedSavings += dailySavings;
      
      return {
        date: dateString,
        dailySavings: dailySavings,
        accumulatedSavings: accumulatedSavings
      };
    });

    setChartData(data);
  }, [monthlyExpenseGoal]);

  useEffect(() => {
    fetchSavingsGoals();
    fetchExpenseData();
    resetDailySavings();
  }, [fetchSavingsGoals, fetchExpenseData, resetDailySavings]);

  useEffect(() => {
    calculateDailySavings();
    const accumulatedSavings = updateTotalSaved();
    updateSavingsGoals(accumulatedSavings);
    prepareChartData();
  }, [calculateDailySavings, updateTotalSaved, updateSavingsGoals, prepareChartData]);

  const handleAddSavingsGoal = async (goalData) => {
    try {
      await axios.post('http://localhost:9000/client/savings', goalData);
      fetchSavingsGoals();
      setOpenDialog(false);
    } catch (err) {
      console.error('Error adding savings goal:', err);
      setError('Failed to add savings goal');
    }
  };

  const handleUpdateSavingsGoal = async (goalData) => {
    if (!selectedGoal) return;
    try {
      await axios.put(`http://localhost:9000/client/savings/${selectedGoal._id}`, goalData);
      fetchSavingsGoals();
      setOpenDialog(false);
      setSelectedGoal(null);
    } catch (err) {
      console.error('Error updating savings goal:', err);
      setError('Failed to update savings goal');
    }
  };

  const handleDeleteSavingsGoal = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/client/savings/${id}`);
      fetchSavingsGoals();
    } catch (err) {
      console.error('Error deleting savings goal:', err);
      setError('Failed to delete savings goal');
    }
  };

  const totalSavingsGoal = savingsGoals.reduce((sum, goal) => sum + parseAmount(goal.targetAmount), 0);
  const overallProgress = totalSavingsGoal > 0 ? Math.min(100, (totalSaved / totalSavingsGoal) * 100) : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
            padding: '10px',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '4px',
            boxShadow: theme.shadows[2],
          }}
        >
          <Typography variant="h6" color="textPrimary">
            Date: {new Date(label).toLocaleDateString()}
          </Typography>
          <Typography variant="h6" color="textPrimary">
            Daily Savings: {formatCurrency(payload[0].value)}
          </Typography>
          <Typography variant="h6" color="secondary">
            Accumulated Savings: {formatCurrency(payload[1].value)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
      <Header title="SAVINGS" subtitle="Small savings, big dreams." />
      
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <StyledCard elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SavingsIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 1 }} />
                      <Typography variant="h6">Total Savings Goal</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(totalSavingsGoal)}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <StyledCard elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SavingsIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 1 }} />
                      <Typography variant="h6">Daily Savings</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(dailySavings)}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <StyledCard elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SavingsIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 1 }} />
                      <Typography variant="h6">Total Saved</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(totalSaved)}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ 
                backgroundColor: theme => theme.palette.mode === 'dark' ? '#2a2a3b' : '#f9f9f9',
                borderRadius: 3,
                boxShadow: theme => theme.palette.mode === 'dark' 
                  ? '0 4px 10px rgba(0, 0, 0, 0.4)'
                  : '0 4px 10px rgba(0, 0, 0, 0.1)',
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Savings Progress</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).getDate()} />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="dailySavings" fill="#8884d8" name="Daily Savings" />
                      <Line type="monotone" dataKey="accumulatedSavings" stroke="#82ca9d" name="Accumulated Savings" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                backgroundColor: theme => theme.palette.mode === 'dark' ? '#2a2a3b' : '#f9f9f9',
                borderRadius: 3,
                boxShadow: theme => theme.palette.mode === 'dark' 
                  ? '0 6px 12px rgba(0, 0, 0, 0.5)'
                  : '0 6px 12px rgba(0, 0, 0, 0.15)',
                padding: 2,
              }}
            >
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Overall Progress</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                  <PiggyBankProgress value={overallProgress}>
                    <Box className="nose">
                      <Box className="nostril" />
                      <Box className="nostril" />
                    </Box>
                    <Box className="eye left" />
                    <Box className="eye right" />
                  </PiggyBankProgress>
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    textAlign: 'center',
                    mt: 2,
                    fontWeight: 'bold',
                    color: theme.palette.mode === 'dark' ? 'white' : '#F8A7D0', // soft pink for light mode
                  }}
                >
                  {`${Math.round(overallProgress)}%`}
                </Typography>
              </CardContent>
            </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Savings Goals</Typography>
        <ProfessionalButton
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedGoal(null);
            setOpenDialog(true);
          }}
        >
          Add New Savings Goal
        </ProfessionalButton>
      </Box>

      <List>
        <AnimatePresence>
          {savingsGoals.map((goal) => {
            const savedAmount = parseAmount(goal.savedAmount);
            const targetAmount = parseAmount(goal.targetAmount);
            const progress = (savedAmount / targetAmount) * 100;

            return (
              <motion.div
                key={goal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SavingsGoalItem>
                  <ListItemText
                    primary={
                      <Typography variant="h6">
                        {goal.goalName} - {formatCurrency(targetAmount)}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography variant="body2" component="span" color="text.secondary">
                          Saved: {formatCurrency(savedAmount)}
                        </Typography>
                        <br />
                        <Typography variant="body2" component="span" color="text.secondary">
                          Start: {formatDate(goal.startDate)} | End: {formatDate(goal.endDate)}
                        </Typography>
                        <br />
                        <Typography variant="body2" component="span" color="text.secondary">
                          Priority: {goal.priority}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min((savedAmount / targetAmount) * 100, 100)}
                              sx={{
                                bgcolor: goal.priority === 'High' ? 'secondary.light' : 'primary.light'
                              }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="text.secondary">
                              {`${Math.round((savedAmount / targetAmount) * 100)}%`}
                            </Typography>
                          </Box>
                        </Box>
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => {
                        setSelectedGoal(goal);
                        setOpenDialog(true);
                      }}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteSavingsGoal(goal._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </SavingsGoalItem>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedGoal ? 'Edit Savings Goal' : 'Add New Savings Goal'}</DialogTitle>
        <DialogContent>
          <SavingsGoalForm
            goal={selectedGoal}
            onSubmit={selectedGoal ? handleUpdateSavingsGoal : handleAddSavingsGoal}
            onClose={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}