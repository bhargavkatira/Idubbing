import React, { useRef, useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Play, Pause, Rewind, FastForward } from 'lucide-react';
import './VideoPlayer.css';

const VideoPlayer = () => {
    const videoRef = useRef(null);
    const audioRef = useRef(new Audio());
    const { 
        videoTime, 
        setVideoTime, 
        isVideoPlaying, 
        setIsVideoPlaying,
        audioBlob,
        setAudioBlob
    } = useAppContext();
    
    const [currentDialogue, setCurrentDialogue] = useState('');
    const recognitionRef = useRef(null);
    const recordingStartTimeRef = useRef(0);

    useEffect(() => {
        const savedVideoTime = localStorage.getItem('videoTime');

        if (savedVideoTime) {
            const time = parseFloat(savedVideoTime);
            videoRef.current.currentTime = time;
            setVideoTime(time);
        }

        // Load the audio blob from local storage if needed
        if (audioBlob) {
            handleAudioBlob(audioBlob);
        }
    }, [setVideoTime, audioBlob]);

    const handleAudioBlob = (blob) => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            audioRef.current.src = url;
            audioRef.current.load(); // Load the new source
            audioRef.current.onloadedmetadata = () => {
                audioRef.current.currentTime = 0; // Reset to the beginning
            };
            recordingStartTimeRef.current = videoRef.current.currentTime;
        }
    };

    useEffect(() => {
        const videoElement = videoRef.current;
        const updateTime = () => setVideoTime(videoElement.currentTime);
        videoElement.addEventListener('timeupdate', updateTime);
        return () => videoElement.removeEventListener('timeupdate', updateTime);
    }, [setVideoTime]);

    useEffect(() => {
        if (isVideoPlaying) {
            videoRef.current.play().catch(error => console.error('Error playing video:', error));
            audioRef.current.play().catch(error => console.error('Error playing audio:', error));
            startSpeechRecognition();
        } else {
            videoRef.current.pause();
            audioRef.current.pause();
            stopSpeechRecognition();
            saveProgress();
        }
    }, [isVideoPlaying]);

    const togglePlay = () => {
        setIsVideoPlaying(!isVideoPlaying);
    };

    const handleSeek = (event) => {
        const seekPercentage = event.target.value;
        const duration = videoRef.current.duration;

        if (duration && !isNaN(duration)) {
            const seekTime = (seekPercentage / 100) * duration;
            videoRef.current.currentTime = seekTime;

            if (audioRef.current) {
                const audioSeekTime = seekTime - recordingStartTimeRef.current;
                if (audioSeekTime >= 0) {
                    audioRef.current.currentTime = audioSeekTime;
                }
            }

            setVideoTime(seekTime);
        } else {
            console.warn("Video duration is not valid:", duration);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleRewind = () => {
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
        audioRef.current.currentTime = videoRef.current.currentTime - recordingStartTimeRef.current;
    };

    const handleForward = () => {
        videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
        audioRef.current.currentTime = videoRef.current.currentTime - recordingStartTimeRef.current;
    };

    const startSpeechRecognition = () => {
        if (!('webkitSpeechRecognition' in window)) {
            console.error('Speech recognition not supported in this browser.');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            setCurrentDialogue(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
            console.log('Speech recognition service disconnected');
        };

        recognition.start();
    };

    const stopSpeechRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const saveProgress = () => {
        localStorage.setItem('videoTime', videoRef.current.currentTime);
        if (audioBlob) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const arrayBuffer = reader.result;
                localStorage.setItem('audioBlob', JSON.stringify(Array.from(new Uint8Array(arrayBuffer))));
            };
            reader.readAsArrayBuffer(audioBlob);
        }
    };

    return (
        <div className="video-container">
            <div className="video-wrapper">
                <video
                    ref={videoRef}
                    className="video"
                    src="/sample-video.mp4"
                    onError={() => {
                        console.error('Error loading video');
                        alert('Could not load the video. Please check the file path.');
                    }}
                    onEnded={() => {
                        setIsVideoPlaying(false);
                        stopSpeechRecognition();
                        audioRef.current.pause();
                    }}
                />
            </div>
            <div className="button-container flex space-x-2 w-full justify-center">
                <button onClick={handleRewind} className="rewind-button">
                    <Rewind className="w-6 h-6 mr-2" />
                </button>
                <button onClick={togglePlay} className="play-button">
                    {isVideoPlaying ? (
                        <Pause className="w-6 h-6 mr-2" />
                    ) : (
                        <Play className="w-6 h-6 mr-2" />
                    )}
                </button>
                <button onClick={handleForward} className="forward-button">
                    <FastForward className="w-6 h-6 mr-2" />
                </button>
            </div>
            <input
                type="range"
                value={(videoTime / (videoRef.current?.duration || 1)) * 100}
                onChange={handleSeek}
                className="range-input"
            />
            <div className="time-labels">
                <span>{formatTime(videoTime)}</span>
                <span>{formatTime(videoRef.current?.duration || 0)}</span>
            </div>
            {audioBlob && (
                <div className="audio-message">
                    Audio recording available for synchronization
                </div>
            )}
            <div className="dialogue-text mt-4">
                <h3>Current Dialogue:</h3>
                <p>{currentDialogue}</p>
            </div>
        </div>
    );    
};

export default VideoPlayer;