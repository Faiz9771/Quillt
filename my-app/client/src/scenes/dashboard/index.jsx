import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, useTheme, Grid, Avatar, IconButton, Button, LinearProgress } from '@mui/material';
import Header from 'components/Header';
import { useAuth } from 'contexts/AuthContext';
import { Settings, Bell, Home, ShoppingCart, Car, Film, Umbrella, Heart, GraduationCap, Utensils, ShoppingBag, Plane, Gift, Wifi, CreditCard, HelpCircle, Briefcase, DollarSign, Percent, Book, Users, Award, Coffee, Zap, PlusCircle, Send } from 'lucide-react';
import { Sector, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, TrendingUp, Building } from 'lucide-react';


// Helper functions remain unchanged
const parseAmount = (value) => {
  if (!value) return 0;
  
  if (typeof value === 'object' && value.$numberDecimal) {
    return parseFloat(value.$numberDecimal);
  }
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
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

const expenseCategories = [
  'Rent', 'Utilities', 'Groceries', 'Transportation', 'Entertainment',
  'Insurance', 'Healthcare', 'Education', 'Dining Out', 'Shopping',
  'Travel', 'Gifts', 'Charity', 'Subscriptions', 'Debt Repayment',
  'Miscellaneous', 'Other'
];

const incomeCategories = [
  'Salary', 'Freelance', 'Business Income', 'Dividends', 'Interest', 'Rental Income',
  'Royalties', 'Gifts', 'Pensions', 'Social Security', 'Grants', 'Side Gigs',
  'Consulting', 'Affiliate Marketing', 'Online Content', 'Other'
];

const getCategoryIcon = (category) => {
  const iconMap = {
    'Rent': <Home />,
    'Utilities': <Zap />,
    'Groceries': <ShoppingCart />,
    'Transportation': <Car />,
    'Entertainment': <Film />,
    'Insurance': <Umbrella />,
    'Healthcare': <Heart />,
    'Education': <GraduationCap />,
    'Dining Out': <Utensils />,
    'Shopping': <ShoppingBag />,
    'Travel': <Plane />,
    'Gifts': <Gift />,
    'Charity': <Coins />,
    'Subscriptions': <Wifi />,
    'Debt Repayment': <CreditCard />,
    'Miscellaneous': <HelpCircle />,
    'Salary': <Briefcase />,
    'Freelance': <DollarSign />,
    'Business Income': <Building />,
    'Dividends': <Percent />,
    'Interest': <Percent />,
    'Rental Income': <Home />,
    'Royalties': <Book />,
    'Pensions': <Users />,
    'Social Security': <Users />,
    'Grants': <Award />,
    'Side Gigs': <Coffee />,
    'Consulting': <Users />,
    'Affiliate Marketing': <Zap />,
    'Online Content': <Wifi />,
    'Other': <HelpCircle />
  };

  return iconMap[category] || <HelpCircle />;
};

const Dashboard = () => {
  const theme = useTheme();
  const [greeting, setGreeting] = useState('');
  const { userData } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalLiquidBalance, setTotalLiquidBalance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [dailyBalances, setDailyBalances] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
  const [financialHealthScore, setFinancialHealthScore] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [investmentCategories, setInvestmentCategories] = useState({});

  useEffect(() => {
    const savedInvestmentCategories = localStorage.getItem('investmentCategories');
    if (savedInvestmentCategories) {
      setInvestmentCategories(JSON.parse(savedInvestmentCategories));
    }
  }, []);

  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      let newGreeting;

      if (currentHour >= 5 && currentHour < 12) {
        newGreeting = 'Good morning';
      } else if (currentHour >= 12 && currentHour < 18) {
        newGreeting = 'Good afternoon';
      } else {
        newGreeting = 'Good evening';
      }

      setGreeting(newGreeting);
    };

    updateGreeting();
    const intervalId = setInterval(updateGreeting, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:9000/client/accounts');
        const accountsData = response.data.filter(account => 
          account.accountType === 'savings' || account.accountType === 'checking'
        );
        setAccounts(accountsData);
        const liquidBalance = accountsData.reduce((total, account) => total + parseAmount(account.balance), 0);
        setTotalLiquidBalance(liquidBalance);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setError('Failed to fetch accounts');
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentAccountIndex((prevIndex) => (prevIndex + 1) % accounts.length);
    }, 5000); // Shuffle every 5 seconds

    return () => clearInterval(intervalId);
  }, [accounts]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:9000/client/expenses');
        const expensesData = response.data;
        setExpenses(expensesData);
        const total = expensesData.reduce((sum, expense) => sum + parseAmount(expense.amount), 0);
        setTotalExpenses(total);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setError('Failed to fetch expenses');
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:9000/client/incomes');
        const incomesData = response.data;
        setIncomes(incomesData);
        const total = incomesData.reduce((sum, income) => sum + parseAmount(income.amount), 0);
        setTotalIncome(total);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching incomes:', error);
        setError('Failed to fetch incomes');
        setLoading(false);
      }
    };

    fetchIncomes();
  }, []);

  useEffect(() => {
    const calculateDailyBalances = () => {
      try {
        setLoading(true);
        const today = new Date();
        const dailyBalancesData = Array.from({ length: 10 }, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateString = date.toISOString().split('T')[0];

          const dailyExpenses = expenses
            .filter(expense => expense.dateSpent.startsWith(dateString))
            .reduce((sum, expense) => sum + parseAmount(expense.amount), 0);

          const dailyIncomes = incomes
            .filter(income => income.dateReceived.startsWith(dateString))
            .reduce((sum, income) => sum + parseAmount(income.amount), 0);

          const dailyBalance = totalLiquidBalance + dailyIncomes - dailyExpenses;

          return {
            date: dateString,
            balance: dailyBalance
          };
        }).reverse();

        setDailyBalances(dailyBalancesData);
        setLoading(false);
      } catch (error) {
        console.error('Error calculating daily balances:', error);
        setError('Failed to calculate daily balances');
        setLoading(false);
      }
    };

    if (expenses.length > 0 && incomes.length > 0 && totalLiquidBalance > 0) {
      calculateDailyBalances();
    }
  }, [expenses, incomes, totalLiquidBalance]);

  useEffect(() => {
    // Calculate financial health score (simplified example)
    const calculateFinancialHealthScore = () => {
      const incomeToExpenseRatio = totalIncome / totalExpenses;
      const savingsRate = (totalIncome - totalExpenses) / totalIncome;
      const liquidityRatio = totalLiquidBalance / totalExpenses;

      let score = 0;
      if (incomeToExpenseRatio > 1.5) score += 33;
      if (savingsRate > 0.2) score += 33;
      if (liquidityRatio > 3) score += 34;

      setFinancialHealthScore(score);
    };

    calculateFinancialHealthScore();
  }, [totalIncome, totalExpenses, totalLiquidBalance]);

  useEffect(() => {
    // Fetch total saved from local storage
    const savedAmount = localStorage.getItem('totalSaved');
    if (savedAmount) {
      setTotalSaved(parseFloat(savedAmount));
    }
  }, []);

  // Extract first name from fullName
  const firstName = userData?.fullName ? userData.fullName.split(' ')[0] : '';
  
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const getInvestmentIcon = (category) => {
    const iconStyle = {
      width: '30px',
      height: '30px',
      padding: '6px',
      borderRadius: '50%',
      marginRight: '8px'
    };

    switch (category) {
      case 'Gold':
        return (
          <div style={{ ...iconStyle, backgroundColor: 'rgba(255, 215, 0, 0.1)' }}>
            <Coins style={{ color: '#FFD700' }} />
          </div>
        );
      case 'Stocks':
        return (
          <div style={{ ...iconStyle, backgroundColor: 'rgba(46, 213, 115, 0.1)' }}>
            <TrendingUp style={{ color: '#2ed573' }} />
          </div>
        );
      case 'Mutual Funds':
        return (
          <div style={{ ...iconStyle, backgroundColor: 'rgba(84, 160, 255, 0.1)' }}>
            <PieChart style={{ color: '#54a0ff' }} />
          </div>
        );
      case 'Real Estate':
        return (
          <div style={{ ...iconStyle, backgroundColor: 'rgba(255, 107, 107, 0.1)' }}>
            <Building style={{ color: '#ff6b6b' }} />
          </div>
        );
      default:
        return null;
    }
  };

  const cardStyle = (mode) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(3),
    transition: 'all 0.3s ease',
    background: mode === 'dark'
      ? 'linear-gradient(135deg, #3b3a4d, #4a4962)'  // Dark mode gradient
      : 'linear-gradient(135deg, #ffffff, #f1f1f1)', // Light mode gradient from white to very light grey
    color: mode === 'dark' ? 'white' : 'black',
    boxShadow: mode === 'dark'
      ? '0px 6px 20px rgba(0, 0, 0, 0.2)'  // Dark mode shadow
      : '0px 6px 16px rgba(0, 0, 0, 0.1)',  // Light mode shadow with a bit more depth
    width: '100%',
    maxWidth: '100%',
    margin: '0 auto',
    borderRadius: '12px',
  });
  
  

  const prepareChartData = (data) => {
    const categoryTotals = data.reduce((acc, item) => {
      const category = item.category;
      const amount = parseAmount(item.amount);
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            padding: '10px',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '6px',
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="body2">{`${payload[0].name} : ${formatCurrency(payload[0].value)}`}</Typography>
        </Box>
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
      <Header title="DASHBOARD" subtitle="Welcome to your control center for better money choices." />

      {/* Greeting Card with Account Display and Piggy Bank */}
      <motion.div variants={itemAnimation}>
        <Grid container spacing={4}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{
              ...cardStyle(theme.palette.mode),
              height: 'auto',
              width: 'auto',
              maxWidth: '600px',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0px 6px 15px rgba(0, 0, 0, 0.2)'  
                : '0px 4px 10px rgba(0, 0, 0, 0.1)',
              background: theme.palette.mode === 'dark' 
                ? '#3b3a4d'
                : '#f9f9f9',
              border: theme.palette.mode === 'dark' 
                ? 'none'
                : '1px solid #ddd',
              transition: 'box-shadow 0.3s ease, transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0px 15px 40px rgba(0, 0, 0, 0.3)'
                  : '0px 10px 30px rgba(0, 0, 0, 0.2)',
              }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {greeting}, {firstName}!
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Your financial journey starts here. Track your expenses, grow your savings, and plan for the future.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* "Total Saved" and Investment Categories */}
          <Grid container item xs={12} spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Total Saved</Typography>
              <Box sx={{ position: 'relative', width: '100px', height: '100px', mb: 2 }}>
                <svg viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill={theme.palette.mode === 'dark' ? '#4a4962' : '#e6e6fa'}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={theme.palette.secondary.main}
                    strokeWidth="10"
                    strokeDasharray={`${(totalSaved / 10000) * 283} 283`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <Coins
                  size={50}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: theme.palette.secondary.light,
                  }}
                />
              </Box>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                {formatCurrency(totalSaved)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(totalSaved / 10000) * 100}
                sx={{ width: '100%', height: 8, borderRadius: 4 }}
              />
            </Grid>

            {/* Account Card */}
            <Grid item xs={12} md={4} sx={{ marginLeft: 'auto' }}>
              <AnimatePresence>
                {accounts[currentAccountIndex] && (
                  <motion.div
                    key={accounts[currentAccountIndex].id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card
                      sx={{
                        ...cardStyle(theme.palette.mode),
                        height: '100%',
                        widht: 'auto',
                        borderRadius: '12px',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0px 10px 30px rgba(0, 0, 0, 0.3)'
                          : '0px 10px 20px rgba(0, 0, 0, 0.15)',
                        background: theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, #3b3a4d, #4a4962)'
                          : 'linear-gradient(135deg, #ffffff, #f8f8f8)',
                        border: theme.palette.mode === 'dark' ? 'none' : '1px solid #e0e0e0',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: theme.palette.mode === 'dark'
                            ? '0px 15px 40px rgba(0, 0, 0, 0.4)'
                            : '0px 15px 30px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          {accounts[currentAccountIndex]?.accountType?.charAt(0).toUpperCase() +
                            accounts[currentAccountIndex]?.accountType?.slice(1)}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(accounts[currentAccountIndex].balance)}
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 1, color: theme.palette.text.secondary }}>
                          Account ending in **** {accounts[currentAccountIndex]?._id?.slice(-4)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </Grid>

            {/* Investment Categories */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ mb: 2 }}>Investment Portfolio</Typography>
              <Grid container spacing={2}>
                {Object.entries(investmentCategories).map(([category, amount], index) => (
                  <Grid item xs={6} sm={3} key={category}>
                    <motion.div
                      variants={itemAnimation}
                      initial="hidden"
                      animate="show"
                      transition={{ delay: index * 0.1 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          p: 1,
                          borderRadius: '12px',
                          background: theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, #3b3a4d, #4a4962)'
                          : 'linear-gradient(135deg, #ffffff, #f8f8f8)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          transition: 'transform 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-5px)'
                          }
                        }}
                      >
                        {getInvestmentIcon(category)}
                        <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 1, textAlign: 'center' }}>
                          {category}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center' }}>
                          {formatCurrency(amount)}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            
          </Grid>
        </Grid>
      </motion.div>




      {/* Overview Section */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Overview:
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={cardStyle(theme.palette.mode)}>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Current month:
              </Typography>
              <Typography variant="h4" sx={{ color: '#4a6cf7', fontWeight: 600 }}>
                +{formatCurrency(totalIncome - totalExpenses)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={cardStyle(theme.palette.mode)}>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Total Balance:
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {formatCurrency(totalLiquidBalance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={cardStyle(theme.palette.mode)}>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Current month:
              </Typography>
              <Typography variant="h4" sx={{ color: '#ff6b6b', fontWeight: 600 }}>
                -{formatCurrency(totalExpenses)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={cardStyle(theme.palette.mode)}>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Financial Health Score:
              </Typography>
              <Typography variant="h4" sx={{ color: financialHealthScore > 66 ? '#4caf50' : financialHealthScore > 33 ? '#ff9800' : '#f44336', fontWeight: 600 }}>
                {financialHealthScore}/100
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle(theme.palette.mode)}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Income Distribution</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={prepareChartData(incomes)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                    >
                      {prepareChartData(incomes).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle(theme.palette.mode)}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Expense Distribution</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={prepareChartData(expenses)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                    >
                      {prepareChartData(expenses).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Daily Balance Line Chart */}
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Card sx={{
            ...cardStyle(theme.palette.mode),
            padding: '12px',
            maxWidth: '500px', // Reduced max width
            width: '100%',  // Ensures the card takes full width up to maxWidth
            marginLeft: '0px',  // Shifts it directly to the left (default)
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1, fontSize: '1rem' }}>Daily Balance</Typography>
              <Box sx={{ height: 200 }}> {/* Reduced height */}
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyBalances} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <defs>
                      <linearGradient id="softGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={theme.palette.mode === "dark" ? "#A569BD" : "#48C9B0"} stopOpacity={0.7} />
                        <stop offset="100%" stopColor={theme.palette.mode === "dark" ? "rgba(165, 105, 189, 0.1)" : "rgba(72, 201, 176, 0.05)"} />
                      </linearGradient>
                    </defs>

                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke={theme.palette.mode === "dark" ? "#A569BD" : "#48C9B0"}
                      strokeWidth={2.5}
                      fill="url(#softGradient)"
                      dot={{ r: 3, stroke: theme.palette.mode === "dark" ? "#A569BD" : "#48C9B0", strokeWidth: 1 }}
                      activeDot={{ r: 5, fill: theme.palette.mode === "dark" ? "#A569BD" : "#48C9B0" }}
                      fillOpacity={1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>



      {/* Recent Transactions Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Recent transactions:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={cardStyle(theme.palette.mode)}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Outcome</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {expenses.slice(0, 3).map((expense, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#74c0fc' }}>
                          {getCategoryIcon(expense.category)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">{expense.description}</Typography>
                          <Typography variant="body2" >{expense.category}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body1" sx={{ color: '#ff6b6b' }}>- {formatCurrency(expense.amount)}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={cardStyle(theme.palette.mode)}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Income</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {incomes.slice(0, 3).map((income, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#51cf66' }}>
                          {getCategoryIcon(income.category)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">{income.description}</Typography>
                          <Typography variant="body2">{income.category}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body1" sx={{ color: '#51cf66' }}>+ {formatCurrency(income.amount)}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;