import React, { useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Mic, StopCircle } from 'lucide-react';
import './AudioRecorder.css';

const AudioRecorder = () => {
    const { recording, setRecording, setAudioBlob, audioBlob } = useAppContext();
    const mediaRecorderRef = useRef(null);
    const audioChunks = useRef([]);
    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        // Retrieve audio blob from local storage if available
        const savedAudio = localStorage.getItem('recordedAudio');
        if (savedAudio) {
            setAudioBlob(new Blob([savedAudio], { type: 'audio/wav' }));
        }
        
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            setRecording(true);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);

            analyserRef.current.fftSize = 2048;
            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const canvas = canvasRef.current;
            const canvasCtx = canvas.getContext('2d');

            const draw = () => {
                animationRef.current = requestAnimationFrame(draw);
                analyserRef.current.getByteTimeDomainData(dataArray);
                canvasCtx.fillStyle = 'rgb(200, 200, 200)';
                canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
                canvasCtx.lineWidth = 2;
                canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
                canvasCtx.beginPath();

                const sliceWidth = canvas.width * 1.0 / bufferLength;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArray[i] / 128.0;
                    const y = v * canvas.height / 2;
                    if (i === 0) {
                        canvasCtx.moveTo(x, y);
                    } else {
                        canvasCtx.lineTo(x, y);
                    }
                    x += sliceWidth;
                }

                canvasCtx.lineTo(canvas.width, canvas.height / 2);
                canvasCtx.stroke();
            };

            draw();

            mediaRecorderRef.current.ondataavailable = event => {
                audioChunks.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                setAudioBlob(audioBlob);
                // Save to local storage
                const reader = new FileReader();
                reader.onloadend = () => {
                    localStorage.setItem('recordedAudio', reader.result);
                };
                reader.readAsDataURL(audioBlob);
                audioChunks.current = [];
            };

            mediaRecorderRef.current.start();
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null; // Reset reference
        }
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null; // Reset reference
        }
        setRecording(false);
    };

    return (
        <div className="audio-recorder-container">
            <h2 className="audio-recorder-title">Audio Recorder</h2>
            <div className="relative w-full">
                <button
                    onClick={recording ? stopRecording : startRecording}
                    className={`record-button record-button-${recording ? 'playing' : 'idle'} record-button-common`}
                >
                    <span className="flex items-center justify-center">
                        {recording ? (
                            <>
                                <StopCircle className="w-6 h-6 mr-2" />
                                Stop Recording
                            </>
                        ) : (
                            <>
                                <Mic className="w-6 h-6 mr-2" />
                                Start Recording
                            </>
                        )}
                    </span>
                </button>
                {recording && (
                    <span className="ping-indicator">
                        <span className="ping"></span>
                        <span className="ping-dot"></span>
                    </span>
                )}
            </div>
            <canvas ref={canvasRef} width="300" height="100" className="w-full" />
            {audioBlob && (
                <audio 
                    controls 
                    src={URL.createObjectURL(audioBlob)} 
                    className="focus:outline-none w-full mt-4"
                />
            )}
        </div>
    );
};

export default AudioRecorder;
