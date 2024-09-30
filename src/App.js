// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import VideoPlayer from './components/VideoPlayer';
import AudioRecorder from './components/AudioRecorder';
import DialogueDisplay from './components/DialogueDisplay';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Logout from './components/Logut';
import './App.css';

const App = () => {
    const [currentComponent, setCurrentComponent] = useState('video'); // Default component

    return (
        <AuthProvider>
            <AppProvider>
                <Router>
                    <div className="container">
                        <div className="card">
                            <h1 className="title">iDub - Interactive Dubbing Tool</h1>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route 
                                    path="/media" 
                                    element={
                                        <PrivateRoute>
                                            <div>
                                                <nav className="flex space-x-4 mb-4">
                                                    <button
                                                        onClick={() => setCurrentComponent('video')}
                                                        className="btn"
                                                    >
                                                        Video
                                                    </button>
                                                    <button
                                                        onClick={() => setCurrentComponent('audio')}
                                                        className="btn"
                                                    >
                                                        Audio
                                                    </button>
                                                    <button
                                                        onClick={() => setCurrentComponent('dialogue')}
                                                        className="btn"
                                                    >
                                                        Dialogue
                                                    </button>
                                                </nav>
                                                {currentComponent === 'video' && <VideoPlayer />}
                                                {currentComponent === 'audio' && <AudioRecorder />}
                                                {currentComponent === 'dialogue' && <DialogueDisplay />}
                                            </div>
                                        </PrivateRoute>
                                    } 
                                />
                                <Route path="/" element={<h2>Welcome! Please <a href="/login">login</a>.</h2>} />
                            </Routes>
                            <Logout />
                        </div>
                    </div>
                </Router>
            </AppProvider>
        </AuthProvider>
    );
};

export default App;
