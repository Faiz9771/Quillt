import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const storedData = JSON.parse(localStorage.getItem('user_data'));

    // Effect to check local storage for user data
    useEffect(() => {
        if (storedData) {
            const {userToken,user} = storedData;
            setToken(userToken);
            setUserData(user);
            setIsAuthenticated(true);
        }
    }, []);

    // Login function to set user data and token
    const login = (newToken, newData) => {
        localStorage.setItem("user_data", JSON.stringify({ userToken: newToken, user: newData }));
        setToken(newToken);
        setUserData(newData);
        setIsAuthenticated(true);
    };

    // Logout function to clear user data
    const logout = () => {
        localStorage.removeItem('user_data');
        setToken(null);
        setUserData(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider 
            value={{ token, isAuthenticated, login, logout, userData }} // Pass values as an object
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);
