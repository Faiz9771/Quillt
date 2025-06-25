import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, CircularProgress, Chip, TextField, Select, MenuItem, InputLabel, FormControl, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Header from 'components/Header';
import axios from 'axios';

const StyledCard = styled(motion(Card))(({ theme, cardType }) => ({
  height: '100%',
  color: 'white',
  borderRadius: '1.5rem',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 30px rgba(0,0,0,0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    bottom: '-50%',
    left: '-50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)',
    transform: 'rotate(30deg)',
  },
  ...(cardType === 'visa' && {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #1A1F71 0%, #2B3990 100%)'
      : 'linear-gradient(135deg, #3A67F2 0%, #6284FD 100%)',
  }),
  ...(cardType === 'mastercard' && {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #FF5F00 0%, #F79E1B 100%)'
      : 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)',
  }),
  ...(cardType === 'amex' && {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #006FCF 0%, #10509E 100%)'
      : 'linear-gradient(135deg, #00BFFF 0%, #1E90FF 100%)',
  }),
}));

const AccountCard = ({ id, accountName, accountType, balance, currency, cardType }) => {
  const lastFourDigits = id.slice(-4);
  const cardNumber = `**** **** **** ${lastFourDigits}`;

  return (
    <StyledCard cardType={cardType} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>{accountName}</Typography>
          <Chip label={accountType} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 'bold' }} />
        </Box>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>{cardNumber}</Typography>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
          {currency} {parseFloat(balance.$numberDecimal || balance).toFixed(2)}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>Balance</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, fontStyle: 'italic', fontWeight: 'bold' }}>
            {cardType.toUpperCase()}
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

const StyledForm = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const FormTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
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

const AddAccountForm = ({ onAdd }) => {
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [interestRate, setInterestRate] = useState('');
  const [minimumBalance, setMinimumBalance] = useState('');
  const [withdrawalLimit, setWithdrawalLimit] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      if (!accountName || !balance || !currency) {
        setErrorMessage('Please fill in all required fields.');
        return;
      }

      const newAccount = {
        accountName,
        accountType,
        balance: parseFloat(balance) || 0,
        currency,
        interestRate: parseFloat(interestRate) || 0,
        minimumBalance: parseFloat(minimumBalance) || 0,
        withdrawalLimit: parseFloat(withdrawalLimit) || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await axios.post('http://localhost:9000/client/accounts', newAccount);
      onAdd(response.data);

      // Clear form fields after successful addition
      setAccountName('');
      setAccountType('savings');
      setBalance('');
      setCurrency('USD');
      setInterestRate('');
      setMinimumBalance('');
      setWithdrawalLimit('');
    } catch (err) {
      console.error('Error adding account:', err);
      setErrorMessage(err.response?.data?.error || 'Failed to add account. Please try again.');
    }
  };

  return (
    <StyledForm component="form" onSubmit={handleAdd}>
      <Typography variant="h6" sx={{ mb: 2 }}>Add New Account</Typography>
      {errorMessage && <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>}
      <FormTextField
        label="Account Name"
        value={accountName}
        onChange={(e) => setAccountName(e.target.value)}
        fullWidth
        required
      />
      <FormControl fullWidth>
        <InputLabel>Account Type</InputLabel>
        <Select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
          <MenuItem value="savings">Savings</MenuItem>
          <MenuItem value="investment">Investment</MenuItem>
          <MenuItem value="checking">Checking</MenuItem>
          <MenuItem value="loan">Loan</MenuItem>
        </Select>
      </FormControl>
      <FormTextField
        label="Balance"
        type="number"
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
        fullWidth
        required
      />
      <FormTextField
        label="Currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        fullWidth
        required
      />
      <FormTextField
        label="Interest Rate"
        type="number"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
        fullWidth
      />
      <FormTextField
        label="Minimum Balance"
        type="number"
        value={minimumBalance}
        onChange={(e) => setMinimumBalance(e.target.value)}
        fullWidth
      />
      <FormTextField
        label="Withdrawal Limit"
        type="number"
        value={withdrawalLimit}
        onChange={(e) => setWithdrawalLimit(e.target.value)}
        fullWidth
      />
      <ProfessionalButton variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
        Add Account
      </ProfessionalButton>
    </StyledForm>
  );
};

const UpdateAccountForm = ({ account, onUpdate }) => {
  const [accountName, setAccountName] = useState(account.accountName);
  const [accountType, setAccountType] = useState(account.accountType);
  const [balance, setBalance] = useState(account.balance.$numberDecimal);
  const [currency, setCurrency] = useState(account.currency);
  const [interestRate, setInterestRate] = useState(account.interestRate);
  const [minimumBalance, setMinimumBalance] = useState(account.minimumBalance);
  const [withdrawalLimit, setWithdrawalLimit] = useState(account.withdrawalLimit);
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const updatedAccount = {
        accountName,
        accountType,
        balance: parseFloat(balance) || 0,
        currency,
        interestRate: parseFloat(interestRate) || 0,
        minimumBalance: parseFloat(minimumBalance) || 0,
        withdrawalLimit: parseFloat(withdrawalLimit) || 0,
        updatedAt: new Date().toISOString()
      };

      const response = await axios.put(`http://localhost:9000/client/accounts/${account._id}`, updatedAccount);
      onUpdate(response.data);
    } catch (err) {
      console.error('Error updating account:', err);
      setErrorMessage(err.response?.data?.error || 'Failed to update account. Please try again.');
    }
  };

  return (
    <StyledForm component="form" onSubmit={handleUpdate}>
      <Typography variant="h6" sx={{ mb: 2 }}>Update Account</Typography>
      {errorMessage && <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>}
      <FormTextField
        label="Account Name"
        value={accountName}
        onChange={(e) => setAccountName(e.target.value)}
        fullWidth
        required
      />
      <FormControl fullWidth>
        <InputLabel>Account Type</InputLabel>
        <Select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
          <MenuItem value="savings">Savings</MenuItem>
          <MenuItem value="investment">Investment</MenuItem>
          <MenuItem value="checking">Checking</MenuItem>
          <MenuItem value="loan">Loan</MenuItem>
        </Select>
      </FormControl>
      <FormTextField
        label="Balance"
        type="number"
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
        fullWidth
        required
      />
      <FormTextField
        label="Currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        fullWidth
        required
      />
      <FormTextField
        label="Interest Rate"
        type="number"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
        fullWidth
      />
      <FormTextField
        label="Minimum Balance"
        type="number"
        value={minimumBalance}
        onChange={(e) => setMinimumBalance(e.target.value)}
        fullWidth
      />
      <FormTextField
        label="Withdrawal Limit"
        type="number"
        value={withdrawalLimit}
        onChange={(e) => setWithdrawalLimit(e.target.value)}
        fullWidth
      />
      <ProfessionalButton variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
        Update Account
      </ProfessionalButton>
    </StyledForm>
  );
};

const DeleteAccountDialog = ({ open, onClose, onConfirm, accountId }) => {
  const [confirmationId, setConfirmationId] = useState('');

  const handleConfirm = () => {
    if (confirmationId === accountId) {
      onConfirm();
    } else {
      alert('The entered ID does not match. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Account Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To confirm the deletion of this account, please enter the full account ID: {accountId}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Account ID"
          type="text"
          fullWidth
          variant="outlined"
          value={confirmationId}
          onChange={(e) => setConfirmationId(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Confirm Deletion
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TransferFundsDialog = ({ open, onClose, onConfirm, accounts }) => {
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirm = () => {
    setErrorMessage('');
    if (!fromAccountId || !toAccountId || !amount) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
    if (fromAccountId === toAccountId) {
      setErrorMessage('Source and destination accounts must be different.');
      return;
    }
    if (parseFloat(amount) <= 0) {
      setErrorMessage('Amount must be greater than zero.');
      return;
    }
    onConfirm(fromAccountId, toAccountId, parseFloat(amount));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Transfer Funds</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please select the source and destination accounts and enter the amount to transfer.
        </DialogContentText>
        {errorMessage && <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>From Account</InputLabel>
          <Select
            value={fromAccountId}
            onChange={(e) => 
              setFromAccountId(e.target.value)}
            label="From Account"
          >
            {accounts.map((account) => (
              <MenuItem key={account._id} value={account._id}>
                {account.accountName} (**** {account._id.slice(-4)})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>To Account</InputLabel>
          <Select
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
            label="To Account"
          >
            {accounts.map((account) => (
              <MenuItem key={account._id} value={account._id}>
                {account.accountName} (**** {account._id.slice(-4)})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Amount"
          type="number"
          fullWidth
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Transfer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:9000/client/accounts');
      setAccounts(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAddAccount = (newAccount) => {
    setAccounts((prevAccounts) => [...prevAccounts, newAccount]);
    setShowAddAccountForm(false);
  };

  const handleUpdateAccount = (updatedAccount) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) => 
        account._id === updatedAccount._id ? updatedAccount : account
      )
    );
    setShowUpdateForm(false);
    setSelectedAccount(null);
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:9000/client/accounts/${accountToDelete._id}`);
      setAccounts((prevAccounts) =>
        prevAccounts.filter((account) => account._id !== accountToDelete._id)
      );
      setDeleteDialogOpen(false);
      setAccountToDelete(null);
      setSelectedAccount(null);
      setShowUpdateForm(false);
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('Failed to delete account. Please try again.');
    }
  };

  const handleTransferFunds = async (fromAccountId, toAccountId, amount) => {
    try {
      const response = await axios.post('http://localhost:9000/client/accounts/transfer', {
        fromAccountId,
        toAccountId,
        amount
      });
      setAccounts((prevAccounts) =>
        prevAccounts.map((account) => {
          if (account._id === fromAccountId) {
            return { ...account, balance: response.data.fromAccount.balance };
          }
          if (account._id === toAccountId) {
            return { ...account, balance: response.data.toAccount.balance };
          }
          return account;
        })
      );
      setTransferDialogOpen(false);
      alert('Funds transferred successfully!');
    } catch (err) {
      console.error('Error transferring funds:', err);
      alert(err.response?.data?.error || 'Failed to transfer funds. Please try again.');
    }
  };

  const calculateTotalBalance = (accounts) => {
    return accounts
      .filter(account => account.accountType === 'savings' || account.accountType === 'checking')
      .reduce((total, account) => total + parseFloat(account.balance.$numberDecimal || account.balance), 0);
  };

  const CARD_TYPES = ['visa', 'mastercard', 'amex'];

  return (
<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
      <Header title="ACCOUNTS" subtitle="Your security is our priority." />
      
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          {error ? (
            <Typography color="error">Error: {error.message}</Typography>
          ) : loading ? (
            <CircularProgress />
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Grid container spacing={3}>
                {accounts.map(({ _id, accountName, accountType, balance }, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={4} key={_id}>
                    <AccountCard
                      id={_id}
                      accountName={accountName}
                      accountType={accountType}
                      balance={balance}
                      currency="USD"
                      cardType={CARD_TYPES[index % CARD_TYPES.length]}
                    />
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}

          {showAddAccountForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AddAccountForm onAdd={handleAddAccount} />
            </motion.div>
          )}

          {showUpdateForm && selectedAccount && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <UpdateAccountForm account={selectedAccount} onUpdate={handleUpdateAccount} />
            </motion.div>
          )}
       </Box>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card sx={{ 
            width: 300, 
            p: 3,
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2, 
            borderRadius: '24px',
            background: theme => theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #1a1a2e, #16213e)'
              : 'linear-gradient(135deg, #E0F2F1, #B2DFDB)',
            color: theme => theme.palette.mode === 'dark' ? 'white' : 'black',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
          }}>
                  <CardContent>
              <Box sx={{ 
                mb: 2, 
                p: 2, 
                bgcolor: 'rgba(255,255,255,0.1)', 
                borderRadius: '16px',
                textAlign: 'center'
              }}>
                <Typography variant="subtitle1" sx={{ color: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)' }}>
                  Total Available Balance
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  ${calculateTotalBalance(accounts).toFixed(2)}
                </Typography>
              </Box>

              <ProfessionalButton
                variant="contained"
                fullWidth
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: theme => theme.palette.mode === 'dark' ? 'white' : 'black',
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.3)' 
                  },
                  textTransform: 'none',
                  borderRadius: '20px',
                  mb: 1
                }}
                onClick={() => setShowAddAccountForm(!showAddAccountForm)}
              >
                {showAddAccountForm ? 'Cancel' : 'Add New Account'}
              </ProfessionalButton>

              <ProfessionalButton
                variant="contained"
                fullWidth
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: theme => theme.palette.mode === 'dark' ? 'white' : 'black',
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.3)' 
                  },
                  textTransform: 'none',
                  borderRadius: '20px',
                  mb: 1
                }}
                onClick={() => setTransferDialogOpen(true)}
              >
                Transfer Funds
              </ProfessionalButton>

              <Typography variant="h6" gutterBottom fontWeight="500">Manage Accounts</Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)' }}>
                  Select Account
                </InputLabel>
                <Select
                  value={selectedAccount ? selectedAccount._id : ''}
                  onChange={(e) => {
                    const accountId = e.target.value;
                    const accountToManage = accounts.find(acc => acc._id === accountId);
                    setSelectedAccount(accountToManage);
                    setShowUpdateForm(!!accountToManage);
                  }}
                  sx={{ 
                    color: theme => theme.palette.mode === 'dark' ? 'white' : 'black',
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': { 
                      borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                      borderColor: theme => theme.palette.mode === 'dark' ? 'white' : 'black'
                    },
                    '& .MuiSvgIcon-root': { 
                      color: theme => theme.palette.mode === 'dark' ? 'white' : 'black'
                    }
                  }}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {accounts.map(({ _id, accountName }) => (
                    <MenuItem key={_id} value={_id}>
                      {accountName} (**** {_id.slice(-4)})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {showUpdateForm && (
                <>
                  <ProfessionalButton
                    variant="contained"
                    fullWidth
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: theme => theme.palette.mode === 'dark' ? 'white' : 'black',
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.3)' 
                      },
                      textTransform: 'none',
                      borderRadius: '20px',
                      mb: 1
                    }}
                    onClick={() => {
                      setShowUpdateForm(false);
                      setSelectedAccount(null);
                    }}
                  >
                    Cancel Selection
                  </ProfessionalButton>

                  <ProfessionalButton
                    variant="contained"
                    fullWidth
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: theme => theme.palette.mode === 'dark' ? 'white' : 'black',
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.3)' 
                      },
                      textTransform: 'none',
                      borderRadius: '20px'
                    }}
                    onClick={() => {
                      setAccountToDelete(selectedAccount);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Delete Account
                  </ProfessionalButton>
                </>
              )}
            </CardContent>
    </Card>

        </motion.div>
      </Box>

      <DeleteAccountDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        accountId={accountToDelete?._id}
      />

      <TransferFundsDialog
        open={transferDialogOpen}
        onClose={() => setTransferDialogOpen(false)}
        onConfirm={handleTransferFunds}
        accounts={accounts}
      />
    </Box>
  );
};

export default Accounts;