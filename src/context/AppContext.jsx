import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [currentDialogue, setCurrentDialogue] = useState(0);
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [videoTime, setVideoTime] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    
    return (
        <AppContext.Provider value={{ 
            currentDialogue, 
            setCurrentDialogue, 
            recording, 
            setRecording, 
            audioBlob, 
            setAudioBlob,
            videoTime,
            setVideoTime,
            isVideoPlaying,
            setIsVideoPlaying
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);