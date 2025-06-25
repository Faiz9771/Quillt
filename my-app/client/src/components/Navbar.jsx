import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    LightModeOutlined, 
    DarkModeOutlined, 
    Menu as MenuIcon, 
    Search, 
    SettingsOutlined, 
    ArrowDropDownOutlined,
    NotificationsNoneOutlined 
} from '@mui/icons-material';
import FlexBetween from './FlexBetween';
import { useDispatch } from 'react-redux';
import { setMode } from 'state';
import logo from "assets/logo.png";
import text from "assets/text.png";
import profileImage from 'assets/profile.png'
import { useAuth } from 'contexts/AuthContext';
import { AppBar, Icon, IconButton, InputBase, Toolbar, useTheme } from '@mui/material';
import {Box,Button,Menu,Typography,MenuItem} from '@mui/material';





const Navbar = ({
    isSidebarOpen,
    setIsSidebarOpen,
}) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { userData, logout } = useAuth();
    const navigate = useNavigate();
    
    const [anchorEl, setAnchorEl] = useState(null);
    const isOpen = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null); //For the time being i m using handle logout for the logout process
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
  
    return (
        <AppBar
            sx={{
                position: "static",
                background: "none",
                boxShadow: "none",
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between" }}>
                {/* Left Side */}
                
                <FlexBetween>
                    <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <MenuIcon />
                    </IconButton>
                    <FlexBetween
                        backgroundColor={theme.palette.background.alt}
                        borderRadius="9px"
                        gap="3rem"
                        p="0.1rem 1.5rem"
                    >
                        <InputBase placeholder="What are you looking for?" />
                        <IconButton>
                            <Search />
                        </IconButton>
                    </FlexBetween>
                </FlexBetween>

                {/*Middle Side*/}
                {/* <FlexBetween gap="1.5rem">
                    <Box component="img" src={text} alt="Logo" sx={{ height: "80px", mr: "0.5rem" }} />
                </FlexBetween> */}

                {/*Right Side*/}
                <FlexBetween gap="1.5rem">
                    <IconButton onClick={()=> dispatch(setMode())}>
                        {theme.palette.mode === 'dark' ? (
                            <DarkModeOutlined sx={{fontSize:"25px"}}/>
                        ):(
                            <LightModeOutlined sx={{fontSize:"25px"}} />
                        ) }
                    </IconButton>
                    <IconButton>
                        <NotificationsNoneOutlined sx={{fontSize:"25px"}} />
                    </IconButton>
                    <FlexBetween>
                        <Button onClick={handleClick} 
                        sx = {{dispaly: "flex", justifyContent: "space-between", 
                        alignItems:"center", textTransform:"none",gap:"1rem" }}>
                        <Box
                                component="img"
                                alt="profile"
                                src={profileImage}
                                width="42px"
                                height="42px"
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
                                fontSize="0.75rem" 
                                sx={{ 
                                    color: theme.palette.secondary[100],
                                }}
                            >
                                {userData?.fullName || "Guest"}
                            </Typography>
                            <Typography 
                                fontWeight="bold" 
                                fontSize="0.7rem" 
                                sx={{ 
                                    color: theme.palette.secondary[100],
                                }}
                            >
                                {userData?.email || "email.com"}
                            </Typography>
                        </Box>
                            <ArrowDropDownOutlined
                            sx={{color: theme.palette.secondary[300], fontSize:"25px"}}
                            />
                        </Button>
                        <Menu anchorEl = {anchorEl} open={isOpen} onClose={handleClose} 
                        anchorOrigin={{vertical: "bottom", 
                        horizontal:"center"}}>
                            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                            <MenuItem>Password Change</MenuItem>
                        </Menu>
                    </FlexBetween>
                </FlexBetween>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;