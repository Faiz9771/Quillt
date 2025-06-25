'use client'

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  DialogActions,
  Switch,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HomeIcon from '@mui/icons-material/Home';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SavingsIcon from '@mui/icons-material/Savings';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlightIcon from '@mui/icons-material/Flight';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import Header from 'components/Header';
import axios from 'axios';
import { Bar, ComposedChart, LineChart, ReferenceLine, Line, AreaChart, Area, PieChart, Pie, Cell, Sector, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'http://localhost:9000';

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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseAmount(amount));
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

const categories = [
  'Rent', 'Utilities', 'Groceries', 'Transportation', 'Entertainment',
  'Insurance', 'Healthcare', 'Education', 'Dining Out', 'Shopping',
  'Travel', 'Gifts', 'Charity', 'Subscriptions', 'Debt Repayment',
  'Miscellaneous', 'Other'
];
const frequencies = ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Annually'];

const categoryIcons = {
  Rent: HomeIcon,
  Utilities: WaterDropIcon,
  Groceries: FastfoodIcon,
  Transportation: DirectionsCarIcon,
  Entertainment: TheaterComedyIcon,
  Insurance: AccountBalanceIcon,
  Healthcare: LocalHospitalIcon,
  Education: SchoolIcon,
  'Dining Out': PersonIcon,
  Shopping: ShoppingCartIcon,
  Travel: FlightIcon,
  Gifts: CardGiftcardIcon,
  Charity: VolunteerActivismIcon,
  Subscriptions: SubscriptionsIcon,
  'Debt Repayment': AccountBalanceIcon,
  Savings: SavingsIcon,
  Miscellaneous: MoreHorizIcon,
  Other: MoreHorizIcon,
};

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

const ExpenseItem = styled(motion(ListItem))(({ theme }) => ({
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

const ExpenseForm = ({ expense, onSubmit, onClose, accounts }) => {
  const [amount, setAmount] = useState(expense ? parseAmount(expense.amount).toString() : '');
  const [category, setCategory] = useState(expense ? expense.category : '');
  const [dateSpent, setDateSpent] = useState(expense ? expense.dateSpent.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [accountId, setAccountId] = useState(expense ? expense.accountId : '');
  const [isRecurring, setIsRecurring] = useState(expense ? expense.isRecurring : false);
  const [frequency, setFrequency] = useState(expense ? expense.frequency || '' : '');
  const [description, setDescription] = useState(expense ? expense.description || '' : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseAmount(amount);
    if (parsedAmount === 0) {
      alert('Please enter a valid amount');
      return;
    }
    onSubmit({
      amount: parsedAmount,
      category,
      dateSpent,
      accountId,
      isRecurring,
      frequency: isRecurring ? frequency : undefined,
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            inputProps={{ step: "0.01" }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {React.createElement(categoryIcons[cat] || MoreHorizIcon, { style: { marginRight: '8px' } })}
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Date Spent"
            type="date"
            value={dateSpent}
            onChange={(e) => setDateSpent(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Account</InputLabel>
            <Select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              {accounts.map((account) => (
                <MenuItem key={account._id} value={account._id}>
                  {account.accountName} (**** {account._id.slice(-4)})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
            }
            label="Recurring Expense"
          />
        </Grid>
        {isRecurring && (
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Frequency</InputLabel>
              <Select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                {frequencies.map((freq) => (
                  <MenuItem key={freq} value={freq}>{freq}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12}>
          <ProfessionalButton type="submit" variant="contained" color="primary" fullWidth>
            {expense ? 'Update Expense' : 'Add Expense'}
          </ProfessionalButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default function Expense() {
  const theme = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [monthlyGoal, setMonthlyGoal] = useState(() => {
    const savedGoal = localStorage.getItem('monthlyGoal');
    return savedGoal ? parseFloat(savedGoal) : 0;
  });
  const [openGoalDialog, setOpenGoalDialog] = useState(false);
  const [tempMonthlyGoal, setTempMonthlyGoal] = useState('');
  const [goalCreatedDate, setGoalCreatedDate] = useState(() => {
    const savedDate = localStorage.getItem('goalCreatedDate');
    return savedDate ? new Date(savedDate) : null;
  });

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/client/expenses`);
      setExpenses(response.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAccounts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/client/accounts`);
      setAccounts(response.data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError('Failed to fetch accounts');
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
    fetchAccounts();
  }, [fetchExpenses, fetchAccounts]);

  const handleAddExpense = async (expenseData) => {
    try {
      await axios.post(`${API_BASE_URL}/client/expenses`, expenseData);
      fetchExpenses();
      setOpenDialog(false);
    } catch (err) {
      console.error('Error adding expense:', err);
      setError('Failed to add expense');
    }
  };

  const handleUpdateExpense = async (expenseData) => {
    if (!selectedExpense) return;
    try {
      await axios.put(`${API_BASE_URL}/client/expenses/${selectedExpense._id}`, expenseData);
      fetchExpenses();
      setOpenDialog(false);
      setSelectedExpense(null);
    } catch (err) {
      console.error('Error updating expense:', err);
      setError('Failed to update expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/client/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError('Failed to delete expense');
    }
  };

  const handleSetMonthlyGoal = () => {
    const goal = parseFloat(tempMonthlyGoal);
    if (!isNaN(goal) && goal > 0) {
      setMonthlyGoal(goal);
      localStorage.setItem('monthlyGoal', goal.toString());
      const newDate = new Date();
      setGoalCreatedDate(newDate);
      localStorage.setItem('goalCreatedDate', newDate.toISOString());
      setOpenGoalDialog(false);
    } else {
      alert('Please enter a valid monthly goal amount');
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseAmount(expense.amount), 0);
  
  const getEarliestExpenseDate = () => {
    if (expenses.length === 0) return null;
    return new Date(Math.min(...expenses.map(e => new Date(e.dateSpent))));
  };

  const prepareChartData = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const dailyGoal = monthlyGoal / daysInMonth;
    let totalExpenses = 0;
    
    const chartData = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(currentYear, currentMonth, i + 1);
      const dateString = date.toISOString().split('T')[0];
      
      const dayExpenses = expenses
        .filter(e => e.dateSpent.startsWith(dateString))
        .reduce((sum, e) => sum + parseAmount(e.amount), 0);
      
      totalExpenses += dayExpenses;
      localStorage.setItem(`dailyExpense_${dateString}`, dayExpenses.toString());
      
      return {
        date: dateString,
        dailyExpense: dayExpenses,
        cumulativeExpense: totalExpenses,
        dailyGoal: dailyGoal,
        cumulativeGoal: dailyGoal * (i + 1)
      };
    });

    return chartData;
  };

  const chartData = prepareChartData();

  const calculateProjection = () => {
    const lastDataPoint = chartData[chartData.length - 1];
    if (!lastDataPoint) return null;

    const currentDate = new Date();
    const daysElapsed = currentDate.getDate();
    const totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const remainingDays = totalDays - daysElapsed;

    const currentExpense = lastDataPoint.cumulativeExpense;
    const projectedFinalExpense = currentExpense + (currentExpense / daysElapsed) * remainingDays;

    if (projectedFinalExpense <= monthlyGoal) {
      return `You're on track to meet your monthly goal!`;
    } else {
      const excessAmount = projectedFinalExpense - monthlyGoal;
      const dailyReduction = excessAmount / remainingDays;
      return `You're projected to exceed your monthly goal by ${formatCurrency(excessAmount)}. To meet your budget, reduce daily expenses by ${formatCurrency(dailyReduction)} for the next ${remainingDays} days.`;
    }
  };

  const prepareExpenseDistributionData = () => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      const category = expense.category || 'Other';
      const amount = parseAmount(expense.amount);
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount
    }));
  };

  const expenseDistributionData = prepareExpenseDistributionData();

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F06292', '#AED581', '#FFD54F', '#4DB6AC', '#7986CB',
    '#9575CD', '#4DD0E1', '#81C784'
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: theme.palette.background.paper,
            padding: '10px',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '4px',
          }}
        >
          <p className="label">{`Date: ${new Date(label).toLocaleDateString()}`}</p>
          {payload[0] && (
            <p className="intro">{`Daily Expense: ${formatCurrency(payload[0].value)}`}</p>
          )}
          {payload[1] && (
            <p className="desc">{`Cumulative Expense: ${formatCurrency(payload[1].value)}`}</p>
          )}
          {payload[2] && (
            <p className="desc">{`Daily Goal: ${formatCurrency(payload[2].value)}`}</p>
          )}
          {payload[3] && (
            <p className="desc">{`Cumulative Goal: ${formatCurrency(payload[3].value)}`}</p>
          )}
        </div>
      );
    }
    return null;
  };
  
  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${formatCurrency(value)}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
      <Header title="EXPENSE" subtitle="Know your outflow to grow your inflow." />
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledCard elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoneyIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 1 }} />
                  <Typography variant="h6">Total Expenses</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(totalExpenses)}
                </Typography>
                {getEarliestExpenseDate() && (
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Since: {formatDate(getEarliestExpenseDate())}
                  </Typography>
                )}
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StyledCard elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SavingsIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 1 }} />
                  <Typography variant="h6">Monthly Budget</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(monthlyGoal)}
                </Typography>
                {goalCreatedDate && (
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Goal set on: {formatDate(goalCreatedDate)}
                  </Typography>
                )}
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card sx={{
              ml: 0,
              mb: 4,
              backgroundColor: theme => theme.palette.mode === 'dark' ? '#2a2a3b' : '#f9f9f9',
              borderRadius: 3,
              boxShadow: theme => theme.palette.mode === 'dark' 
                ? '0 4px 10px rgba(0, 0, 0, 0.4)'
                : '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}>
              <CardContent>
              <Typography variant="h6" sx={{ mb: 2}}>Expense Rate</Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(tick) => new Date(tick).getDate()} 
                      stroke={theme.palette.text.primary}
                    />
                    <YAxis stroke={theme.palette.text.primary} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="dailyExpense" fill={theme.palette.secondary[400]} name="Daily Expense" />
                    <Line 
                      type="monotone" 
                      dataKey="cumulativeExpense" 
                      stroke={theme.palette.secondary.main} 
                      name="Cumulative Expense" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="dailyGoal" 
                      stroke={theme.palette.warning.main} 
                      strokeDasharray="5 5" 
                      name="Daily Goal" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cumulativeGoal" 
                      stroke={theme.palette.success.main} 
                      strokeDasharray="5 5" 
                      name="Cumulative Goal" 
                    />
                    <ReferenceLine 
                      y={monthlyGoal} 
                      stroke={theme.palette.error.main} 
                      strokeDasharray="3 3" 
                    />
                  </ComposedChart>
                </ResponsiveContainer>
                <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {calculateProjection()}
                </Typography>
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
              ml: 0,
              mb: 4,
              backgroundColor: theme => theme.palette.mode === 'dark' ? '#2a2a3b' : '#f9f9f9',
              borderRadius: 3,
              boxShadow: theme => theme.palette.mode === 'dark' 
                ? '0 4px 10px rgba(0, 0, 0, 0.4)'
                : '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}>
              <CardContent>
              <Typography variant="h6" sx={{ mb: 2}}>Expense Distribution</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={expenseDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {expenseDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Expense Records</Typography>
        <Box>
          <ProfessionalButton
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedExpense(null);
              setOpenDialog(true);
            }}
            sx={{ mr: 2 }}
          >
            Add New Expense
          </ProfessionalButton>
          <ProfessionalButton
            variant="contained"
            color="primary"
            startIcon={<SavingsIcon />}
            onClick={() => setOpenGoalDialog(true)}
          >
            Set Monthly Budget
          </ProfessionalButton>
        </Box>
      </Box>

      <List>
        <AnimatePresence>
        {expenses.map((expense) => {
          const IconComponent = categoryIcons[expense.category] || MoreHorizIcon;
          return (
            <motion.div
            key={expense._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3}}
            >
            <ExpenseItem key={expense._id}>
              <IconComponent sx={{ mr: 2, color: theme.palette.primary.main }} />
              <ListItemText
                primary={
                  <Typography variant="h6">
                    {expense.category} - {formatCurrency(expense.amount)}
                  </Typography>
                }
                secondary={
                  <React.Fragment>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(expense.dateSpent)}
                    </Typography>
                    {expense.isRecurring && (
                      <Typography variant="body2" color="text.secondary">
                        Recurring: {expense.frequency}
                      </Typography>
                    )}
                    {expense.description && (
                      <Typography variant="body2" color="text.secondary">
                        {expense.description}
                      </Typography>
                    )}
                  </React.Fragment>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => {
                    setSelectedExpense(expense);
                    setOpenDialog(true);
                  }}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteExpense(expense._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ExpenseItem>
            </motion.div>
          );
        })}
        </AnimatePresence>
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        <DialogContent>
          <ExpenseForm
            expense={selectedExpense}
            onSubmit={selectedExpense ? handleUpdateExpense : handleAddExpense}
            onClose={() => setOpenDialog(false)}
            accounts={accounts}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openGoalDialog} onClose={() => setOpenGoalDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Set Monthly Goal</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Monthly Goal Amount"
            type="number"
            fullWidth
            value={tempMonthlyGoal}
            onChange={(e) => setTempMonthlyGoal(e.target.value)}
            inputProps={{ min: "0", step: "0.01" }}
          />
        </DialogContent>
        <DialogActions>
          <ProfessionalButton onClick={() => setOpenGoalDialog(false)} color="primary" variant="outlined">Cancel</ProfessionalButton>
          <ProfessionalButton onClick={handleSetMonthlyGoal} color="primary" variant="contained">Set Goal</ProfessionalButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}