import React, { useState, useEffect, useRef } from 'react';

const GeographyQuiz = () => {
  const [puzzles] = useState([
    { 
      question: "What is the capital of France?", 
      answer: "paris",
      hint: "This city is known as the City of Light and has the Eiffel Tower."
    },
    { 
      question: "Which is the largest ocean on Earth?", 
      answer: "pacific",
      hint: "It covers more than 30% of the Earth's surface and touches Asia and the Americas."
    },
    { 
      question: "What is the longest river in the world?", 
      answer: "nile",
      hint: "This African river flows through Egypt and is over 6,600 kilometers long."
    },
    { 
      question: "Which desert is the largest hot desert in the world?", 
      answer: "sahara",
      hint: "Located in North Africa, it covers most of the northern portion of the continent."
    },
    { 
      question: "What is the highest mountain in the world?", 
      answer: "everest",
      hint: "Located in the Himalayas, its peak is over 29,000 feet above sea level."
    },
    { 
      question: "Which country has the largest population in the world?", 
      answer: "india",
      hint: "This Asian country surpassed its neighbor in population in 2023."
    },
    { 
      question: "What is the smallest country in the world by land area?", 
      answer: "vatican city",
      hint: "This European city-state is the headquarters of the Roman Catholic Church."
    },
    { 
      question: "Which continent is the driest inhabited continent on Earth?", 
      answer: "australia",
      hint: "This continent is also known as the Land Down Under."
    },
    { 
      question: "Which mountain range separates Europe from Asia?", 
      answer: "ural",
      hint: "These mountains run north to south through western Russia."
    },
    { 
      question: "What is the capital of Brazil?", 
      answer: "brasilia",
      hint: "This planned city replaced Rio de Janeiro as the capital in 1960."
    }
  ]);

  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('ready'); // ready, speaking, listening, evaluating, finished
  const [message, setMessage] = useState('Press the Start button or press Space to begin the quiz!');
  const [selectedPuzzles, setSelectedPuzzles] = useState([]);
  const [spokenAnswer, setSpokenAnswer] = useState('');
  const [hintShown, setHintShown] = useState(false);
  
  const recognition = useRef(null);
  const speechSynthesis = useRef(window.speechSynthesis);
  const utterance = useRef(new SpeechSynthesisUtterance());

  // Initialize speech recognition
  useEffect(() => {
    try {
      // Check if SpeechRecognition is supported
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        recognition.current.lang = 'en-US';

        recognition.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('')
            .trim()
            .toLowerCase();
          
          setSpokenAnswer(transcript);
        };

        recognition.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setMessage('Sorry, there was an error with speech recognition. Please try again.');
          setGameState('speaking');
        };
      } else {
        setMessage('Speech recognition is not supported in this browser.');
      }
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      setMessage('Error initializing speech recognition. Please try a different browser.');
    }

    // Select 5 random puzzles at the start
    const shuffled = [...puzzles].sort(() => 0.5 - Math.random());
    setSelectedPuzzles(shuffled.slice(0, 5));
  }, []);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault();
        
        if (gameState === 'ready') {
          startQuiz();
        } else if (gameState === 'speaking') {
          // Start listening
          startListening();
        } else if (gameState === 'listening') {
          // Stop listening and evaluate
          stopListeningAndEvaluate();
        }
      }
      
      // Handle Enter key for hints
      if ((event.key === 'Enter' || event.code === 'Enter') && gameState === 'speaking' && !hintShown) {
        event.preventDefault();
        provideHint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, currentPuzzleIndex, selectedPuzzles, spokenAnswer, hintShown]);

  // Clean up speech synthesis and recognition
  useEffect(() => {
    return () => {
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
      }
      if (recognition.current) {
        recognition.current.abort();
      }
    };
  }, []);

  const startQuiz = () => {
    if (selectedPuzzles.length === 0) return;
    
    setCurrentPuzzleIndex(0);
    setScore(0);
    setGameState('speaking');
    setHintShown(false);
    speakQuestion(selectedPuzzles[0].question);
  };

  const speakQuestion = (question) => {
    setMessage(`Question ${currentPuzzleIndex + 1}: ${question}\nPress space to start answering or Enter for a hint.`);
    utterance.current.text = question;
    utterance.current.onend = () => {
      setMessage(`Question ${currentPuzzleIndex + 1}: ${question}\nPress space to start answering or Enter for a hint.`);
    };
    speechSynthesis.current.speak(utterance.current);
  };

  const provideHint = () => {
    const currentHint = selectedPuzzles[currentPuzzleIndex].hint;
    setHintShown(true);
    setMessage(`Question ${currentPuzzleIndex + 1}: ${selectedPuzzles[currentPuzzleIndex].question}\n\nHint: ${currentHint}\n\nPress space to start answering.`);
    
    speakFeedback(currentHint);
  };

  const startListening = () => {
    setGameState('listening');
    setSpokenAnswer('');
    setMessage(`Question ${currentPuzzleIndex + 1}: ${selectedPuzzles[currentPuzzleIndex].question}\nListening... Speak your answer and press space again when done.`);
    
    try {
      recognition.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setMessage('Error starting speech recognition. Please try again.');
      setGameState('speaking');
    }
  };

  const speakFeedback = (text) => {
    return new Promise((resolve) => {
      const feedbackUtterance = new SpeechSynthesisUtterance(text);
      feedbackUtterance.onend = resolve;
      speechSynthesis.current.speak(feedbackUtterance);
    });
  };

  const stopListeningAndEvaluate = () => {
    try {
      recognition.current.stop();
      setGameState('evaluating');
      
      // Get the current answer from the selected puzzle
      const currentAnswer = selectedPuzzles[currentPuzzleIndex].answer.toLowerCase();
      
      // Compare with the spoken answer - use includes to be more forgiving with longer answers
      const isCorrect = spokenAnswer.includes(currentAnswer);
      
      if (isCorrect) {
        setScore(prevScore => prevScore + 5);
        setMessage(`Correct! You said "${spokenAnswer}" which contains the right answer: "${currentAnswer}".`);
        speakFeedback(`Correct! You said ${spokenAnswer}, which is right.`).then(() => {
          setTimeout(() => nextQuestion(), 2000);
        });
      } else {
        setMessage(`Incorrect. You said "${spokenAnswer}", but the correct answer is "${currentAnswer}".`);
        speakFeedback(`Incorrect. You said ${spokenAnswer}, but the correct answer is ${currentAnswer}.`).then(() => {
          setTimeout(() => nextQuestion(), 2000);
        });
      }
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      setGameState('speaking');
    }
  };

  const nextQuestion = () => {
    const nextIndex = currentPuzzleIndex + 1;
    
    if (nextIndex < selectedPuzzles.length) {
      setCurrentPuzzleIndex(nextIndex);
      setGameState('speaking');
      setHintShown(false);
      speakQuestion(selectedPuzzles[nextIndex].question);
    } else {
      setGameState('finished');
      const finalMessage = `Quiz completed! Your final score is ${score} out of 25.`;
      setMessage(finalMessage);
      speakFeedback(finalMessage);
    }
  };

  const restartQuiz = () => {
    // Shuffle and select new puzzles
    const shuffled = [...puzzles].sort(() => 0.5 - Math.random());
    setSelectedPuzzles(shuffled.slice(0, 5));
    setGameState('ready');
    setMessage('Press the Start button or Space to begin the quiz!');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Geography Quiz Game</h1>
        
        <div className="mb-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 min-h-32">
            <p className="text-lg whitespace-pre-line">{message}</p>
            {gameState === 'listening' && (
              <div className="mt-2 p-2 bg-blue-100 rounded">
                <p className="font-medium">Currently hearing: "{spokenAnswer}"</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-center text-xl font-semibold">
              Score: {score} / 25
            </p>
            <p className="text-center text-sm mt-1">
              Question {currentPuzzleIndex + 1} of {selectedPuzzles.length}
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-center">
              {gameState === 'ready' && 'Press space to start the quiz'}
              {gameState === 'speaking' && 'Press space to start answering or Enter for a hint'}
              {gameState === 'listening' && 'Speak your answer and press space when done'}
              {gameState === 'evaluating' && 'Checking your answer...'}
              {gameState === 'finished' && 'Quiz completed!'}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-4">
          {gameState === 'ready' && (
            <button 
              onClick={startQuiz}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Start Quiz
            </button>
          )}
          
          {gameState === 'speaking' && !hintShown && (
            <button 
              onClick={provideHint}
              className="w-full bg-yellow-500 text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
            >
              Get Hint
            </button>
          )}
          
          {gameState === 'speaking' && (
            <button 
              onClick={startListening}
              className="flex-grow bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Answering
            </button>
          )}
          
          {gameState === 'listening' && (
            <button 
              onClick={stopListeningAndEvaluate}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Check Answer
            </button>
          )}
          
          {gameState === 'finished' && (
            <button 
              onClick={restartQuiz}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Play Again
            </button>
          )}
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Instructions:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Press the Start button or Space key to begin</li>
            <li>Listen to each geography question</li>
            <li>Press Enter if you need a hint</li>
            <li>Press Space to start recording your answer</li>
            <li>Speak your answer clearly</li>
            <li>Press Space again to stop recording and check your answer</li>
            <li>Score 5 points for each correct answer</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GeographyQuiz;