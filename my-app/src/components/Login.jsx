import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            setIsAuthenticated(true);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        const redirectToMedia = async () => {
            if (isAuthenticated) {
                await navigate('/media');
            }
        };
        redirectToMedia();
    }, [isAuthenticated, navigate]);

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4"> {/* Add space between elements */}
                    <input
                        type="text"
                        className="login-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    <input
                        type="password"
                        className="login-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        autoComplete="current-password"
                    />
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
