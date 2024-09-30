import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './DialogueDisplay.css'; // Import the CSS file

const dialogues = [
    { original: "Hello, how are you?", translated: "¿Hola, cómo estás?" },
    { original: "What's your name?", translated: "¿Cómo te llamas?" },
    { original: "Nice to meet you.", translated: "Encantado de conocerte." },
    { original: "Where are you from?", translated: "¿De dónde eres?" },
    { original: "Have a great day!", translated: "¡Que tengas un buen día!" },
];

const DialogueDisplay = () => {
    const { currentDialogue, setCurrentDialogue } = useAppContext();
    const { original, translated } = dialogues[currentDialogue];

    const handlePrevious = () => {
        setCurrentDialogue((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleNext = () => {
        setCurrentDialogue((prev) => (prev < dialogues.length - 1 ? prev + 1 : prev));
    };

    return (
        <div className="dialogue-container">
            <h2 className="dialogue-title">Current Dialogue</h2>
            <div className="input-group"> {/* Use input-group for spacing */}
                <div>
                    <label htmlFor="original" className="label">Original Text</label>
                    <input
                        id="original"
                        value={original}
                        onChange={(e) => {
                            dialogues[currentDialogue].original = e.target.value;
                        }}
                        placeholder="Enter original text"
                        className="input" // Apply the input styles
                    />
                </div>
                <div>
                    <label htmlFor="translated" className="label">Translated Text</label>
                    <input
                        id="translated"
                        value={translated}
                        onChange={(e) => {
                            dialogues[currentDialogue].translated = e.target.value;
                        }}
                        placeholder="Enter translated text"
                        className="input" // Apply the input styles
                    />
                </div>
            </div>
            <div className="button-container">
                <button
                    onClick={handlePrevious}
                    disabled={currentDialogue === 0}
                    className="button"
                >
                    <ChevronLeft className="w-5 h-5 mr-2" /> Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentDialogue === dialogues.length - 1}
                    className="button"
                >
                    Next <ChevronRight className="w-5 h-5 ml-2" />
                </button>
            </div>
        </div>
    );
    
};

export default DialogueDisplay;
