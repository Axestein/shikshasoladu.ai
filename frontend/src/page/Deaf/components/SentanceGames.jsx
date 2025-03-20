import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import * as fp from 'fingerpose';

const Games = () => {
  const [sentence, setSentence] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [score, setScore] = useState(0);
  const [lastDetectedLetter, setLastDetectedLetter] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [model, setModel] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // List of predefined sentences
  const sentences = [
    "This is a cat",
    "I love you",
    "How are you",
    "Nice to meet you",
    "Sign language is fun",
    "Let us play a game",
    "The sun is bright",
    "Birds fly high",
    "Water is blue",
    "Trees are green"
  ];
  
  // Helper function to get a random sentence
  const getRandomSentence = () => {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    return sentences[randomIndex];
  };
  
  // Initialize the game
  useEffect(() => {
    setSentence(getRandomSentence());
    setCurrentIndex(0);
    startCamera();
    loadHandposeModel();
  }, []);
  
  // Load the handpose model
  const loadHandposeModel = async () => {
    try {
      // Make sure TensorFlow.js backend is initialized
      await tf.ready();
      const loadedModel = await handpose.load();
      setModel(loadedModel);
      console.log("Handpose model loaded!");
    } catch (error) {
      console.error("Failed to load handpose model:", error);
    }
  };
  
  // Start the camera
  const startCamera = async () => {
    try {
      const constraints = {
        video: { 
          width: 640, 
          height: 480, 
          facingMode: 'user' 
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraReady(true);
        };
      }
    } catch (error) {
      console.error("Error starting camera:", error);
    }
  };
  
  // Process video frames to detect hand signs
  useEffect(() => {
    if (!model || !cameraReady || isProcessing) return;
    
    const detectHands = async () => {
      setIsProcessing(true);
      
      try {
        if (videoRef.current && canvasRef.current && model) {
          // Detect hand landmarks
          const predictions = await model.estimateHands(videoRef.current);
          
          if (predictions.length > 0) {
            // Get the current expected letter
            const expectedLetter = sentence[currentIndex].toUpperCase();
            
            // Check if the detected hand sign matches the expected letter
            // This is a simplified version - in a real app, you'd have a more sophisticated
            // sign language recognition system
            const detectedLetter = recognizeHandSign(predictions[0].landmarks);
            
            if (detectedLetter) {
              setLastDetectedLetter(detectedLetter);
              
              if (detectedLetter === expectedLetter) {
                // Correct letter detected
                setFeedback(`Correct! ${detectedLetter} detected.`);
                
                // Move to the next letter
                if (currentIndex < sentence.length - 1) {
                  setCurrentIndex(prevIndex => prevIndex + 1);
                } else {
                  // Sentence completed
                  setScore(prevScore => prevScore + 10);
                  setShowPopup(true);
                  setTimeout(() => {
                    setShowPopup(false);
                    // Reset with a new sentence
                    setSentence(getRandomSentence());
                    setCurrentIndex(0);
                  }, 3000);
                }
              } else {
                setFeedback(`Keep trying! ${detectedLetter} detected, but we need ${expectedLetter}.`);
              }
            }
            
            // Draw hand landmarks on canvas
            drawHand(predictions[0].landmarks, canvasRef.current);
          }
        }
      } catch (error) {
        console.error("Error detecting hands:", error);
      }
      
      setIsProcessing(false);
    };
    
    const intervalId = setInterval(detectHands, 1000); // Check every second
    
    return () => clearInterval(intervalId);
  }, [model, cameraReady, isProcessing, sentence, currentIndex]);
  
  // Simplified hand sign recognition function
  // In a real app, you'd use a more sophisticated method
  const recognizeHandSign = (landmarks) => {
    // This is a placeholder - in a real app, you would implement
    // actual sign language recognition based on the landmarks
    
    // For demonstration purposes, we'll return a random letter
    // In a real implementation, you would use the landmarks to determine the letter
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters[Math.floor(Math.random() * letters.length)];
  };
  
  // Draw hand landmarks on canvas
  const drawHand = (landmarks, canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < landmarks.length; i++) {
      const point = landmarks[i];
      ctx.beginPath();
      ctx.arc(point[0], point[1], 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#FF0000';
      ctx.fill();
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Sign Language Game</h1>
      
      <div className="score-board mb-4 p-2 bg-blue-500 text-white rounded-md">
        Score: {score}
      </div>
      
      <div className="sentence-display mb-6 p-4 bg-white rounded-md shadow-md">
        <p className="text-xl font-semibold mb-2">Sentence to sign:</p>
        <div className="flex space-x-1">
          {sentence.split('').map((letter, index) => (
            <span 
              key={index} 
              className={`text-2xl font-mono px-2 py-1 rounded-md ${
                index === currentIndex ? 'bg-yellow-300 font-bold' : 
                index < currentIndex ? 'bg-green-200' : 'bg-gray-200'
              }`}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
      
      <div className="camera-display relative mb-6">
        <video 
          ref={videoRef} 
          width="640" 
          height="480" 
          className="rounded-md shadow-md"
          style={{ transform: 'scaleX(-1)' }}
        />
        <canvas 
          ref={canvasRef} 
          width="640" 
          height="480" 
          className="absolute top-0 left-0 z-10"
          style={{ transform: 'scaleX(-1)' }}
        />
        <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md opacity-80">
          <p className="text-sm font-semibold">Current letter: {sentence[currentIndex]}</p>
          <p className="text-sm">Last detected: {lastDetectedLetter}</p>
        </div>
      </div>
      
      <div className="feedback mt-4 p-2 text-center">
        <p className="text-lg font-medium">{feedback}</p>
      </div>
      
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Very Good!</h2>
            <p className="text-xl">+10 points</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Games;