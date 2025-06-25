import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { themeSettings } from "theme";
import { useAuth } from "contexts/AuthContext";

import Register from "Auth/Register";// Fixed typo here
import Login from "Auth/Login";
import Dashboard from "scenes/dashboard";
import Layout from "scenes/layout";
import Accounts from "scenes/accounts";
import Income from "scenes/income";
import Expense from "scenes/expense";
import Transactions from "scenes/transactions";
import Analysis from "scenes/analysis";
import Savings from "scenes/savings";

function App() {
    const mode = useSelector((state) => state.global.mode);
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    const { isAuthenticated } = useAuth();


    return (
        <div className='app'>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Routes>
                        <Route path="/" element={!isAuthenticated ? <Register /> : <Navigate to='/dashboard' />} />
                        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
                        <Route element={<Layout />}>
                            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                            <Route path="/accounts" element={<Accounts/>} />
                            <Route path="/income" element={<Income/>} />
                            <Route path="/expense" element={<Expense/>} />
                            <Route path="/transactions" element={<Transactions/>} />
                            <Route path="/analysis" element={<Analysis/>} />
                            <Route path="/savings" element={<Savings/>} />
                        </Route>
                    </Routes>
                </ThemeProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
