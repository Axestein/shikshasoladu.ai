import React, { useEffect, useState, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useNavigate } from 'react-router-dom';

const BlindAuth = () => {
  const [secretWord, setSecretWord] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  // Secret word to authenticate
  const SECRET_WORD = 'open';

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Speak text using Web Speech API
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Play audio cue for status changes
  const playAudio = (type) => {
    if (audioRef.current) {
      audioRef.current.src = type === 'success' 
        ? '/sounds/success.mp3' 
        : '/sounds/listening.mp3';
      audioRef.current.play().catch(err => console.log('Audio playback error:', err));
    }
  };

  // Check if the transcript contains the secret word
  useEffect(() => {
    if (transcript.toLowerCase().includes(SECRET_WORD)) {
      setIsAuthenticated(true);
      resetTranscript();
      playAudio('success');
      speak('Authentication successful. Redirecting to main page.');
      
      // Give time for the speech to complete before redirecting
      setTimeout(() => {
        navigate('/mainblind');
      }, 2500);
    } else if (transcript && transcript.length > 10) {
      // Check if user has said something but not the secret word
      setAttemptCount(prev => prev + 1);
      setFeedback('Please try again. Say the secret word clearly.');
      resetTranscript();
      
      // After 3 attempts, provide a hint
      if (attemptCount >= 2) {
        setFeedback(`Hint: The secret word rhymes with "hope". Try again.`);
        speak('Hint: The secret word rhymes with hope. Try again.');
      }
    }
  }, [transcript, navigate, resetTranscript, attemptCount]);

  // Start listening when the component mounts
  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true });
      playAudio('listening');
      speak('Welcome to the authentication page. Please say the secret word to continue.');
    }
    
    // Clean up speech recognition when component unmounts
    return () => {
      SpeechRecognition.stopListening();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [browserSupportsSpeechRecognition]);

  // Toggle listening with keyboard
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        if (listening) {
          SpeechRecognition.stopListening();
          speak('Listening paused. Press space to resume.');
        } else {
          SpeechRecognition.startListening({ continuous: true });
          speak('Listening resumed.');
          playAudio('listening');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [listening]);

  // Fallback if speech recognition is not supported
  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100" role="main" aria-label="Authentication page fallback">
        <h1 className="text-2xl font-bold mb-6">Authentication Required</h1>
        <p className="text-red-500 mb-4" aria-live="assertive">
          Your browser does not support speech recognition. Please use the text input below.
        </p>
        <label htmlFor="secretInput" className="sr-only">Enter the secret word</label>
        <input
          id="secretInput"
          type="text"
          placeholder="Enter the secret word"
          value={secretWord}
          onChange={(e) => setSecretWord(e.target.value)}
          className="p-4 border text-xl rounded-lg mb-4 w-64"
          aria-required="true"
        />
        <button
          onClick={() => {
            if (secretWord.toLowerCase() === SECRET_WORD) {
              navigate('/mainblind');
            } else {
              setFeedback('Incorrect word. Please try again.');
            }
          }}
          className="px-6 py-3 bg-blue-500 text-white text-xl rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 focus:outline-none"
          aria-label="Submit secret word"
        >
          Submit
        </button>
        {feedback && (
          <p className="mt-4 text-red-500" aria-live="assertive">{feedback}</p>
        )}
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white" 
      role="main" 
      aria-label="Voice authentication page"
    >
      <audio ref={audioRef} className="sr-only" />
      
      <h1 className="text-3xl font-bold mb-8">Voice Authentication</h1>
      
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <div 
          className={`flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full ${listening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
          aria-live="polite"
          aria-label={listening ? 'Microphone is active' : 'Microphone is inactive'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        
        <p className="text-xl mb-4 text-center" aria-live="polite">
          Say the secret word to continue
        </p>
        
        <p className="text-gray-400 text-center mb-6" aria-live="polite">
          {listening ? 'Listening...' : 'Microphone inactive. Press space to reactivate.'}
        </p>
        
        <div className="relative p-4 bg-gray-700 rounded-lg mb-6" aria-live="polite">
          <p className="text-gray-300 text-sm mb-2">You said:</p>
          <p className="text-lg">{transcript || "(Waiting for speech...)"}</p>
        </div>
        
        {feedback && (
          <div className="p-4 bg-blue-900 rounded-lg mb-6" aria-live="assertive">
            <p className="text-lg">{feedback}</p>
          </div>
        )}
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              if (listening) {
                SpeechRecognition.stopListening();
                speak('Listening paused.');
              } else {
                SpeechRecognition.startListening({ continuous: true });
                speak('Listening resumed.');
                playAudio('listening');
              }
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none"
            aria-label={listening ? "Stop listening" : "Start listening"}
          >
            {listening ? "Pause" : "Resume"}
          </button>
          
          <button
            onClick={() => {
              resetTranscript();
              speak('Transcript cleared.');
            }}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-500 focus:outline-none"
            aria-label="Clear transcript"
          >
            Clear
          </button>
        </div>
        
        <p className="mt-6 text-sm text-gray-400 text-center">
          Press the space bar to toggle listening mode
        </p>
      </div>
    </div>
  );
};

export default BlindAuth;