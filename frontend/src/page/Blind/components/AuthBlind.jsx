import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthBlind = () => {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);
  const navigate = useNavigate();

  // Predefined unique word for authentication
  const uniqueWord = 'apple';

  // Use a ref to store the SpeechRecognition instance
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessage('Your browser does not support speech recognition.');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.continuous = false; // Stop after one result
    recognition.interimResults = false; // Only final results
    recognition.lang = 'en-US';

    // Handle speech recognition results
    recognition.onresult = (event) => {
      const spokenWord = event.results[0][0].transcript.trim().toLowerCase();
      if (spokenWord === uniqueWord) {
        setMessage('Authentication successful! Redirecting...');
        setAuthSuccess(true);
        // Speak success message
        const utterance = new SpeechSynthesisUtterance('Authentication successful. Redirecting to the blind page.');
        window.speechSynthesis.speak(utterance);
        // Redirect after a short delay
        setTimeout(() => navigate('/blind'), 3000);
      } else {
        setMessage('Authentication failed. Please try again.');
        // Speak failure message
        const utterance = new SpeechSynthesisUtterance('Authentication failed. Please try again.');
        window.speechSynthesis.speak(utterance);
      }
      setIsListening(false);
    };

    // Handle errors
    recognition.onerror = (event) => {
      setMessage('Error occurred. Please try again.');
      setIsListening(false);
    };

    // Cleanup function to stop recognition when the component unmounts
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [navigate]);

  // Start listening when the component mounts
  useEffect(() => {
    if (!isListening && recognitionRef.current) {
      const utterance = new SpeechSynthesisUtterance('Please say the unique word to authenticate.');
      window.speechSynthesis.speak(utterance);
      setIsListening(true);
      recognitionRef.current.start();
    }
  }, [isListening]);

  return (
    <div>
      <h1>Voice-Based Authentication</h1>
      <p>{message}</p>
      {isListening && <p>Listening...</p>}
      {authSuccess && <p>Redirecting to the blind page...</p>}
    </div>
  );
};

export default AuthBlind;