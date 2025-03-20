import React, { useState, useEffect, useRef } from 'react';

const QuizApp = () => {
  const [historyPuzzles] = useState([
    { 
      question: "In which year did World War II end?", 
      answer: "1945",
      hint: "This global conflict ended shortly after atomic bombs were dropped on Japan."
    },
    { 
      question: "Who was the first President of the United States?", 
      answer: "george washington",
      hint: "He led the Continental Army during the American Revolutionary War."
    },
    { 
      question: "Which ancient civilization built the pyramids of Giza?", 
      answer: "egyptian",
      hint: "This North African civilization flourished along the Nile River for thousands of years."
    },
    { 
      question: "In which year did the French Revolution begin?", 
      answer: "1789",
      hint: "This revolution led to the end of the monarchy and the rise of Napoleon Bonaparte."
    },
    { 
      question: "Who wrote the Communist Manifesto?", 
      answer: "karl marx",
      hint: "This German philosopher co-authored this document with Friedrich Engels."
    },
    { 
      question: "Which empire was ruled by Caesar Augustus?", 
      answer: "roman",
      hint: "This ancient Mediterranean empire had its capital in the city that is now Italy's capital."
    },
    { 
      question: "In which year did Christopher Columbus first reach the Americas?", 
      answer: "1492",
      hint: "He sailed across the Atlantic with three ships: the Niña, the Pinta, and the Santa Maria."
    },
    { 
      question: "Who was the leader of the Indian independence movement against British rule?", 
      answer: "gandhi",
      hint: "This leader was known for his nonviolent resistance and civil disobedience."
    },
    { 
      question: "Which medieval English document limited the power of the monarchy in 1215?", 
      answer: "magna carta",
      hint: "This charter of rights was agreed to by King John at Runnymede."
    },
    { 
      question: "Who was the first female pharaoh of Egypt?", 
      answer: "hatshepsut",
      hint: "She ruled in the 15th century BCE and was known for her extensive building projects."
    }
  ]);

  const [geographyPuzzles] = useState([
    { 
      question: "Which is the largest ocean on Earth?", 
      answer: "pacific",
      hint: "This ocean covers more than 30% of the Earth's surface."
    },
    { 
      question: "What is the capital city of Australia?", 
      answer: "canberra",
      hint: "Not Sydney or Melbourne, but a planned city designed specifically to be the capital."
    },
    { 
      question: "Which is the longest river in the world?", 
      answer: "nile",
      hint: "This river flows through 11 countries in northeastern Africa."
    },
    { 
      question: "Which country has the largest population in the world?", 
      answer: "india",
      hint: "This Asian country surpassed its neighbor in population in 2023."
    },
    { 
      question: "What is the largest desert in the world?", 
      answer: "sahara",
      hint: "This hot desert covers much of North Africa."
    },
    { 
      question: "Which mountain range separates Europe from Asia?", 
      answer: "ural",
      hint: "These mountains run from north to south through Russia and Kazakhstan."
    },
    { 
      question: "Which country has the most natural lakes?", 
      answer: "canada",
      hint: "This North American country contains about 60% of all the lakes in the world."
    },
    { 
      question: "What is the smallest country in the world by land area?", 
      answer: "vatican city",
      hint: "This independent city-state is entirely surrounded by Rome, Italy."
    },
    { 
      question: "Which continent is the driest inhabited continent on Earth?", 
      answer: "australia",
      hint: "This continent is also the smallest of all continents."
    },
    { 
      question: "Which African country was formerly known as Abyssinia?", 
      answer: "ethiopia",
      hint: "This country in the Horn of Africa is one of the oldest countries in the world."
    }
  ]);

  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('ready'); // ready, speaking, listening, evaluating, finished
  const [message, setMessage] = useState('Select a quiz category and press Start or Space to begin!');
  const [selectedPuzzles, setSelectedPuzzles] = useState([]);
  const [spokenAnswer, setSpokenAnswer] = useState('');
  const [hintShown, setHintShown] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [quizType, setQuizType] = useState('history'); // 'history' or 'geography'
  
  const recognition = useRef(null);
  const speechSynthesis = useRef(window.speechSynthesis);
  const utterance = useRef(new SpeechSynthesisUtterance());
  const timerRef = useRef(null);

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

    // Select initial puzzles based on quiz type
    selectPuzzlesForQuizType('history');
  }, []);

  // Function to select puzzles based on quiz type
  const selectPuzzlesForQuizType = (type) => {
    const puzzlesToUse = type === 'history' ? historyPuzzles : geographyPuzzles;
    const shuffled = [...puzzlesToUse].sort(() => 0.5 - Math.random());
    setSelectedPuzzles(shuffled.slice(0, 5));
    setQuizType(type);
  };

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

  // Timer effect
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timerActive && timeRemaining === 0) {
      setTimerActive(false);
      if (gameState === 'listening') {
        stopListeningAndEvaluate();
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeRemaining, timerActive, gameState]);

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

  // Change quiz type and restart
  const changeQuizType = (type) => {
    if (gameState === 'listening') {
      try {
        recognition.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
    
    if (speechSynthesis.current.speaking) {
      speechSynthesis.current.cancel();
    }
    
    selectPuzzlesForQuizType(type);
    setGameState('ready');
    setScore(0);
    setCurrentPuzzleIndex(0);
    setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} Quiz selected! Press Start or Space to begin.`);
    setTimerActive(false);
    setHintShown(false);
  };

  const startQuiz = () => {
    if (selectedPuzzles.length === 0) return;
    
    setCurrentPuzzleIndex(0);
    setScore(0);
    setGameState('speaking');
    setHintShown(false);
    setTimeRemaining(30);
    setTimerActive(false);
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
    setTimeRemaining(30);
    setTimerActive(true);
    
    try {
      recognition.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setMessage('Error starting speech recognition. Please try again.');
      setGameState('speaking');
      setTimerActive(false);
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
      setTimerActive(false);
      
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
      setTimeRemaining(30);
      setTimerActive(false);
      speakQuestion(selectedPuzzles[nextIndex].question);
    } else {
      setGameState('finished');
      const finalScore = score;
      let feedbackMessage = '';
      
      if (finalScore === 25) {
        feedbackMessage = 'Perfect score! You are a master!';
      } else if (finalScore >= 20) {
        feedbackMessage = 'Excellent! You really know your stuff!';
      } else if (finalScore >= 15) {
        feedbackMessage = 'Good job! You have solid knowledge.';
      } else if (finalScore >= 10) {
        feedbackMessage = 'Not bad. Keep studying!';
      } else {
        feedbackMessage = 'Time to brush up on your knowledge!';
      }
      
      const finalMessage = `Quiz completed! Your final score is ${finalScore} out of 25. ${feedbackMessage}`;
      setMessage(finalMessage);
      speakFeedback(finalMessage);
    }
  };

  const restartQuiz = () => {
    // Shuffle and select new puzzles for the current quiz type
    selectPuzzlesForQuizType(quizType);
    setGameState('ready');
    setMessage(`${quizType.charAt(0).toUpperCase() + quizType.slice(1)} Quiz selected! Press Start or Space to begin.`);
  };

  // Calculate progress percentage
  const progressPercentage = (currentPuzzleIndex / selectedPuzzles.length) * 100;
  
  // Timer color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining > 20) return 'bg-green-500';
    if (timeRemaining > 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="mr-4">
            {quizType === 'history' ? (
              <svg className="w-12 h-12 text-amber-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
              </svg>
            ) : (
              <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"></path>
              </svg>
            )}
          </div>
          <h1 className={`text-4xl font-bold text-center ${quizType === 'history' ? 'text-amber-700' : 'text-blue-700'}`}>
            {quizType === 'history' ? 'History' : 'Geography'} Quiz Challenge
          </h1>
        </div>
        
        {/* Quiz Type Selector */}
        {gameState === 'ready' && (
          <div className="mb-6 flex space-x-4 justify-center">
            <button
              onClick={() => changeQuizType('history')}
              className={`px-6 py-3 rounded-lg font-bold shadow-md flex items-center justify-center transition-colors ${
                quizType === 'history' 
                  ? 'bg-amber-600 text-white ring-2 ring-amber-400' 
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
              </svg>
              History Quiz
            </button>
            <button
              onClick={() => changeQuizType('geography')}
              className={`px-6 py-3 rounded-lg font-bold shadow-md flex items-center justify-center transition-colors ${
                quizType === 'geography' 
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"></path>
              </svg>
              Geography Quiz
            </button>
          </div>
        )}
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`${quizType === 'history' ? 'bg-amber-600' : 'bg-blue-600'} h-2.5 rounded-full transition-all duration-500 ease-in-out`} 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-right text-sm text-gray-600 mt-1">
            Question {currentPuzzleIndex + 1} of {selectedPuzzles.length}
          </p>
        </div>
        
        {/* Question and message display */}
        <div className="mb-6">
          <div className={`${quizType === 'history' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'} p-6 rounded-lg border min-h-36 shadow-inner`}>
            <p className="text-lg whitespace-pre-line leading-relaxed">{message}</p>
            {gameState === 'listening' && (
              <div className={`mt-4 p-3 rounded-lg border ${quizType === 'history' ? 'bg-amber-100 border-amber-200' : 'bg-blue-100 border-blue-200'}`}>
                <p className={`font-medium ${quizType === 'history' ? 'text-amber-800' : 'text-blue-800'}`}>Currently hearing: "{spokenAnswer}"</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Score and timer display */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`${quizType === 'history' ? 'bg-amber-100' : 'bg-blue-100'} p-4 rounded-lg shadow-sm`}>
            <p className={`text-center ${quizType === 'history' ? 'text-amber-800' : 'text-blue-800'} text-xs uppercase font-semibold`}>Current Score</p>
            <p className={`text-center text-3xl font-bold ${quizType === 'history' ? 'text-amber-700' : 'text-blue-700'}`}>
              {score} <span className={`text-lg ${quizType === 'history' ? 'text-amber-500' : 'text-blue-500'}`}>/ 25</span>
            </p>
          </div>
          
          {gameState === 'listening' && (
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <p className="text-center text-gray-800 text-xs uppercase font-semibold">Time Remaining</p>
              <div className="flex items-center justify-center">
                <div className={`text-center text-3xl font-bold ${timeRemaining <= 10 ? 'text-red-600' : 'text-gray-700'}`}>
                  {timeRemaining}
                </div>
                <div className="ml-1 text-lg text-gray-500">sec</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className={`${getTimerColor()} h-2 rounded-full transition-all duration-500 ease-in-out`} 
                  style={{ width: `${(timeRemaining/30) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {gameState !== 'listening' && (
            <div className={`${quizType === 'history' ? 'bg-amber-50' : 'bg-blue-50'} p-4 rounded-lg shadow-sm`}>
              <p className={`text-center ${quizType === 'history' ? 'text-amber-800' : 'text-blue-800'} text-xs uppercase font-semibold`}>Game Status</p>
              <p className={`text-center font-bold text-xl ${quizType === 'history' ? 'text-amber-700' : 'text-blue-700'}`}>
                {gameState === 'ready' && 'Ready to Start'}
                {gameState === 'speaking' && 'Question Ready'}
                {gameState === 'evaluating' && 'Evaluating Answer'}
                {gameState === 'finished' && 'Quiz Completed'}
              </p>
            </div>
          )}
        </div>
        
        {/* Game status indicator */}
        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-center font-medium text-gray-700">
              {gameState === 'ready' && 'Press space to start the quiz'}
              {gameState === 'speaking' && 'Press space to start answering or Enter for a hint'}
              {gameState === 'listening' && 'Speak your answer and press space when done'}
              {gameState === 'evaluating' && 'Checking your answer...'}
              {gameState === 'finished' && 'Quiz completed!'}
            </p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-4">
          {gameState === 'ready' && (
            <button 
              onClick={startQuiz}
              className={`w-full ${quizType === 'history' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'} text-white py-4 rounded-lg font-bold transition-colors shadow-md flex items-center justify-center`}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
              </svg>
              Start Quiz
            </button>
          )}
          
          {gameState === 'speaking' && !hintShown && (
            <button 
              onClick={provideHint}
              className="w-1/2 bg-yellow-500 text-white py-4 rounded-lg font-bold hover:bg-yellow-600 transition-colors shadow-md flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              Get Hint
            </button>
          )}
          
          {gameState === 'speaking' && (
            <button 
              onClick={startListening}
              className={`${hintShown ? 'w-full' : 'w-1/2'} bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md flex items-center justify-center`}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"></path>
              </svg>
              Start Answering
            </button>
          )}
          
          {gameState === 'listening' && (
            <button 
              onClick={stopListeningAndEvaluate}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              Check Answer
            </button>
          )}
          
          {gameState === 'finished' && (
            <button 
              onClick={restartQuiz}
              className={`w-full ${quizType === 'history' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'} text-white py-4 rounded-lg font-bold transition-colors shadow-md flex items-center justify-center`}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
              </svg>
              Play Again
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-center text-gray-600 text-sm">
        <p>Press <span className="font-bold bg-gray-200 px-2 py-1 rounded">Space</span> to interact with the quiz and <span className="font-bold bg-gray-200 px-2 py-1 rounded">Enter</span> for hints.</p>
      </div>
    </div>
  );
};

export default QuizApp;