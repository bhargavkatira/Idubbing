// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const mockUsers = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
];

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);

    // Load authentication state from local storage on initial render
    useEffect(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        if (storedAuth) {
            setIsAuthenticated(JSON.parse(storedAuth));
        }
    }, []);

    const login = (username, password) => {
        const user = mockUsers.find(
            (user) => user.username === username && user.password === password
        );

        if (user) {
            setIsAuthenticated(true);
            setError(null); // Clear any previous error
            localStorage.setItem('isAuthenticated', true); // Persist authentication
        } else {
            setError('Invalid username or password');
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setError(null); // Clear any error on logout
        localStorage.removeItem('isAuthenticated'); // Clear stored authentication
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
