import React, { useEffect, useState } from 'react';
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme,
} from "@mui/material";
import {
    ChevronLeft,
    ChevronRightOutlined,
    HomeOutlined,
    AccountBalanceWalletOutlined,
    CurrencyRupeeOutlined,
    ShoppingCartOutlined,
    ImportExportOutlined,
    TrendingUpOutlined,
    SavingsOutlined,
    LogoutOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from 'react-router-dom';
import FlexBetween from './FlexBetween';
import text from "assets/text.png";
import logo from "assets/logo.png";
import { useAuth } from 'contexts/AuthContext';
import profileImage from 'assets/profile.png'

const navItems = [
    { text: "Dashboard", icon: <HomeOutlined /> },
    { text: "Accounts", icon: <AccountBalanceWalletOutlined /> },
    { text: "Income", icon: <CurrencyRupeeOutlined /> },
    { text: "Expense", icon: <ShoppingCartOutlined /> },
    { text: "Transactions", icon: <ImportExportOutlined /> },
    { text: "Analysis", icon: <TrendingUpOutlined /> },
    { text: "Savings", icon: <SavingsOutlined /> },
];

const Sidebar = ({ user, drawerWidth, isSidebarOpen, setIsSidebarOpen, isNonMobile }) => {
    const { pathname } = useLocation();
    const [active, setActive] = useState("");
    const navigate = useNavigate();
    const theme = useTheme();
    const { userData, logout } = useAuth();

    useEffect(() => {
        setActive(pathname.substring(1));
    }, [pathname]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <Box component="nav">
            <Drawer
                open={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                variant='persistent'
                anchor='left'
                sx={{
                    width: drawerWidth,
                    "& .MuiDrawer-paper": {
                        color: theme.palette.secondary[100],
                        backgroundColor: theme.palette.background.alt,
                        boxSizing: "border-box",
                        borderWidth: isNonMobile ? 0 : "2px",
                        width: drawerWidth,
                        transition: "all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)",
                        transform: isSidebarOpen ? 'translateX(0)' : `translateX(-${drawerWidth}px)`,
                    }
                }}
            >
                <Box width="100%" display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                    <Box>
                        <Box m="0.5rem 2rem 2rem 3rem">
                            <FlexBetween color={theme.palette.secondary.main}>
                            <Box display="flex" alignItems="center" gap="0.3rem" >
                                <Box 
                                    component="img" 
                                    src={text}  
                                    alt="Quillt text" 
                                    sx={{ 
                                        marginLeft:"15px",
                                        height: "120px", 
                                        transition: "all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)",
                                        filter: isSidebarOpen ? "opacity(1)" : "opacity(0)",
                                        transform: isSidebarOpen ? "scale(1)" : "scale(0.8)",
                                    }}
                                />
                            </Box>

                                {!isNonMobile && (
                                    <IconButton 
                                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                        sx={{
                                            transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
                                            "&:hover": {
                                                transform: "rotate(180deg)",
                                            }
                                        }}
                                    >
                                        <ChevronLeft />
                                    </IconButton>
                                )}
                            </FlexBetween>
                        </Box>
                        <Divider sx={{ mb:2}} />




                        <List>
                            {navItems.map(({ text, icon }) => {
                                const lcText = text.toLowerCase();
                                const isActive = active === lcText;

                                return (
                                    <ListItem
                                        key={text}
                                        disablePadding
                                        sx={{
                                            backgroundColor: isActive ? theme.palette.secondary[300] : "transparent",
                                            borderRadius: "8px",
                                            mb: "0.5rem",
                                            overflow: "hidden",
                                            transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
                                        }}
                                    >
                                        <ListItemButton
                                            onClick={() => {
                                                navigate(`/${lcText}`);
                                                setActive(lcText);
                                            }}
                                            sx={{
                                                backgroundColor: active === lcText ? theme.palette.secondary[300] : "transparent",
                                                color: active === lcText ? theme.palette.primary[600] : theme.palette.secondary[100],
                                                transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
                                                "&:hover": {
                                                    backgroundColor: theme.palette.secondary[300],
                                                    color: theme.palette.primary[600],
                                                    paddingLeft: "2.5rem",
                                                },
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    ml: "2rem",
                                                    color: active === lcText ? theme.palette.primary[600] : theme.palette.secondary[200],
                                                    transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
                                                }}
                                            >
                                                {icon}
                                            </ListItemIcon>
                                            <ListItemText primary={text} />
                                            {active === lcText && (
                                                <ChevronRightOutlined 
                                                    sx={{ 
                                                        ml: "auto",
                                                        transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
                                                        transform: "translateX(0)",
                                                    }} 
                                                />
                                            )}
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>

                    <Box>
                        <Divider sx={{ mb:2 }} />
                        <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
                            <Box
                                component="img"
                                alt="profile"
                                src={profileImage}
                                width="50px"
                                height="50px"
                                borderRadius="50%"
                                sx={{
                                    objectFit:"cover",
                                    transition: "all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)",
                                    "&:hover": {
                                        transform: "scale(1.1) rotate(5deg)",
                                        boxShadow: "0 0 15px rgba(0,0,0,0.2)",
                                    },
                                }}
                            />
                            <Box textAlign="left">
                                <Typography 
                                    fontWeight="bold" 
                                    fontSize="0.8rem" 
                                    sx={{ 
                                        color: theme.palette.secondary[100],
                                    }}
                                >
                                    {userData?.fullName || "Guest"}
                                </Typography>
                            </Box>
                            <LogoutOutlined
                                onClick={handleLogout}
                                sx={{
                                    color: theme.palette.secondary[300],
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    transition: "all 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)",
                                    "&:hover": {
                                        transform: "scale(1.24)",
                                        boxShadow: "0 0 15px rgba(0,0,0,0.2)",
                                    },
                                }}
                            />
                        </FlexBetween>
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
}

export default Sidebar;