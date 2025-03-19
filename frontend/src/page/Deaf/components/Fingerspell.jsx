import React, { useState, useEffect, useRef } from 'react';

const FingerspellingChallenge = () => {
  // Game state
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameMode, setGameMode] = useState('menu'); // 'menu', 'play', 'result'
  const [currentWord, setCurrentWord] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [timeLeft, setTimeLeft] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [difficulty, setDifficulty] = useState('easy');
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [signInterval, setSignInterval] = useState(null);
  const [currentLetter, setCurrentLetter] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // Reference for the answer input
  const answerInputRef = useRef(null);

  // Word lists by difficulty
  const wordLists = {
    easy: ['CAT', 'DOG', 'PIG', 'COW', 'SUN', 'MAP', 'HAT', 'BED', 'TIN', 'MUG'],
    medium: ['APPLE', 'BEACH', 'CLOCK', 'DREAM', 'EARTH', 'FRUIT', 'GLOVE', 'HONEY', 'JUMPS', 'KITES'],
    hard: ['RAINBOW', 'BICYCLE', 'DOLPHIN', 'ELEPHANT', 'FLAMINGO', 'GIRAFFE', 'HARVEST', 'JOURNEY', 'MOUNTAIN', 'WHISPER']
  };

  // ASL fingerspelling images using a more reliable approach
  // Using a mapping of letters to reliable image sources
  const aslImages = {
    'A': 'https://www.signingsavvy.com/images/words/alphabet/2/a1.jpg',
    'B': 'https://www.signingsavvy.com/images/words/alphabet/2/b1.jpg',
    'C': 'https://www.signingsavvy.com/images/words/alphabet/2/c1.jpg',
    'D': 'https://www.signingsavvy.com/images/words/alphabet/2/d1.jpg',
    'E': 'https://www.signingsavvy.com/images/words/alphabet/2/e1.jpg',
    'F': 'https://www.signingsavvy.com/images/words/alphabet/2/f1.jpg',
    'G': 'https://www.signingsavvy.com/images/words/alphabet/2/g1.jpg',
    'H': 'https://www.signingsavvy.com/images/words/alphabet/2/h1.jpg',
    'I': 'https://www.signingsavvy.com/images/words/alphabet/2/i1.jpg',
    'J': 'https://www.signingsavvy.com/images/words/alphabet/2/j1.jpg',
    'K': 'https://www.signingsavvy.com/images/words/alphabet/2/k1.jpg',
    'L': 'https://www.signingsavvy.com/images/words/alphabet/2/l1.jpg',
    'M': 'https://www.signingsavvy.com/images/words/alphabet/2/m1.jpg',
    'N': 'https://www.signingsavvy.com/images/words/alphabet/2/n1.jpg',
    'O': 'https://www.signingsavvy.com/images/words/alphabet/2/o1.jpg',
    'P': 'https://www.signingsavvy.com/images/words/alphabet/2/p1.jpg',
    'Q': 'https://www.signingsavvy.com/images/words/alphabet/2/q1.jpg',
    'R': 'https://www.signingsavvy.com/images/words/alphabet/2/r1.jpg',
    'S': 'https://www.signingsavvy.com/images/words/alphabet/2/s1.jpg',
    'T': 'https://www.signingsavvy.com/images/words/alphabet/2/t1.jpg',
    'U': 'https://www.signingsavvy.com/images/words/alphabet/2/u1.jpg',
    'V': 'https://www.signingsavvy.com/images/words/alphabet/2/v1.jpg',
    'W': 'https://www.signingsavvy.com/images/words/alphabet/2/w1.jpg',
    'X': 'https://www.signingsavvy.com/images/words/alphabet/2/x1.jpg',
    'Y': 'https://www.signingsavvy.com/images/words/alphabet/2/y1.jpg',
    'Z': 'https://www.signingsavvy.com/images/words/alphabet/2/z1.jpg'
  };

  // Get sign image for a letter
  const getSignImageUrl = (letter) => {
    const upperLetter = letter.toUpperCase();
    return aslImages[upperLetter] || `/api/placeholder/200/200?text=${upperLetter}&bg=white`;
  };

  // Get random word based on difficulty
  const getRandomWord = () => {
    const words = wordLists[difficulty];
    return words[Math.floor(Math.random() * words.length)];
  };

  // Initialize game settings
  const initializeGame = () => {
    const word = getRandomWord();
    setCurrentWord(word);
    setUserAnswer('');
    setFeedback({ message: '', type: '' });
    setTimeLeft(getDifficultyTime());
    setShowHint(false);
    setHintUsed(false);
    setCurrentSignIndex(0);
    setCurrentLetter('');
    setIsPlaying(false);
    
    // Focus on the input field
    if (answerInputRef.current) {
      answerInputRef.current.focus();
    }
  };

  // Get time based on difficulty
  const getDifficultyTime = () => {
    switch (difficulty) {
      case 'easy': return 30;
      case 'medium': return 25;
      case 'hard': return 20;
      default: return 30;
    }
  };

  // Start game
  const startGame = () => {
    setGameMode('play');
    setScore(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setCurrentLevel(1);
    initializeGame();
  };

  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  // Handle answer submission
  const handleSubmit = () => {
    if (userAnswer.trim() === '') return;
    
    const isCorrect = userAnswer.trim().toUpperCase() === currentWord;
    
    if (isCorrect) {
      setFeedback({ message: 'Correct! Well done!', type: 'success' });
      setScore(score + calculateScore());
      setCorrectAnswers(correctAnswers + 1);
      setCurrentLevel(currentLevel + 1);
    } else {
      setFeedback({ message: `Incorrect. The word was "${currentWord}"`, type: 'error' });
      setWrongAnswers(wrongAnswers + 1);
    }
    
    // Show feedback for 2 seconds before moving to next word
    setTimeout(() => {
      if (isCorrect) {
        // If reached level 10, end game
        if (currentLevel >= 10) {
          endGame();
        } else {
          initializeGame();
        }
      } else {
        initializeGame();
      }
    }, 2000);
  };

  // Calculate score based on difficulty, time left, and hint usage
  const calculateScore = () => {
    let baseScore = 0;
    switch (difficulty) {
      case 'easy': baseScore = 10; break;
      case 'medium': baseScore = 20; break;
      case 'hard': baseScore = 30; break;
      default: baseScore = 10;
    }
    
    const timeBonus = Math.floor(timeLeft * 0.5);
    const hintPenalty = hintUsed ? 0.5 : 1;
    
    return Math.floor((baseScore + timeBonus) * hintPenalty);
  };

  // End game and show results
  const endGame = () => {
    setGameMode('result');
    if (score > highScore) {
      setHighScore(score);
    }
  };

  // Show hint
  const showHintHandler = () => {
    setHintUsed(true);
    setShowHint(true);
    
    // Hide hint after 3 seconds
    setTimeout(() => {
      setShowHint(false);
    }, 3000);
  };

  // Start fingerspelling animation
  const startFingerspelling = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setCurrentSignIndex(0);
    setCurrentLetter(currentWord[0] || '');
    
    const interval = setInterval(() => {
      setCurrentSignIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= currentWord.length) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        setCurrentLetter(currentWord[nextIndex] || '');
        return nextIndex;
      });
    }, 1000);
    
    setSignInterval(interval);
  };

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (signInterval) {
        clearInterval(signInterval);
      }
    };
  }, [signInterval]);

  // Timer countdown
  useEffect(() => {
    if (gameMode !== 'play' || timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          // Time's up, move to next word
          setFeedback({ message: `Time's up! The word was "${currentWord}"`, type: 'error' });
          setWrongAnswers(wrongAnswers + 1);
          
          // Show feedback for 2 seconds before moving to next word
          setTimeout(() => {
            initializeGame();
          }, 2000);
          
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [gameMode, timeLeft, currentWord, wrongAnswers]);

  // Start fingerspelling when a new word is set
  useEffect(() => {
    if (currentWord && gameMode === 'play') {
      startFingerspelling();
    }
  }, [currentWord, gameMode]);

  // Render main menu
  const renderMenu = () => (
    <div className="flex flex-col items-center w-full max-w-md">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Fingerspelling Challenge</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-md w-full mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Difficulty:</h2>
        <div className="flex justify-between gap-4 mb-6">
          {['easy', 'medium', 'hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => handleDifficultyChange(diff)}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                difficulty === diff 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-600 mb-6">
          <p><strong>Easy:</strong> 3-letter words, 30 seconds</p>
          <p><strong>Medium:</strong> 5-letter words, 25 seconds</p>
          <p><strong>Hard:</strong> 7-letter words, 20 seconds</p>
        </div>
        
        <button
          onClick={startGame}
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
        >
          Start Game
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md w-full">
        <h2 className="text-xl font-semibold mb-4">How to Play:</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>Watch the fingerspelling signs carefully</li>
          <li>Type the word you think is being spelled</li>
          <li>Submit your answer before time runs out</li>
          <li>Earn points based on difficulty, speed, and accuracy</li>
          <li>Complete 10 levels to finish the game</li>
        </ol>
      </div>
      
      {highScore > 0 && (
        <div className="mt-6 text-xl font-bold text-blue-600">
          High Score: {highScore}
        </div>
      )}
    </div>
  );

  // Render game screen
  const renderGame = () => (
    <div className="flex flex-col items-center w-full max-w-lg">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-sm text-gray-500">Level</span>
            <p className="text-2xl font-bold text-blue-600">{currentLevel}/10</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Score</span>
            <p className="text-2xl font-bold text-blue-600">{score}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Time</span>
            <p className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-blue-600'}`}>{timeLeft}s</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="text-center mb-2">
            <span className="text-sm text-gray-500">Watch the sign:</span>
          </div>
          <div className="flex justify-center mb-4">
            <div className="w-64 h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-gray-200">
              {isPlaying ? (
                <div className="relative w-56 h-56">
                  <img 
                    src={getSignImageUrl(currentLetter)}
                    alt={`ASL sign for letter ${currentLetter}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback in case the image doesn't load
                      e.target.onerror = null;
                      e.target.src = `/api/placeholder/200/200?text=${currentLetter}&bg=white`;
                    }}
                  />
                  <div className="absolute bottom-0 right-0 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">
                    {currentSignIndex + 1}/{currentWord.length}
                  </div>
                </div>
              ) : (
                <button 
                  onClick={startFingerspelling}
                  className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                >
                  Play Again
                </button>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
              What word is being spelled?
            </label>
            <div className="flex gap-2">
              <input
                ref={answerInputRef}
                type="text"
                id="answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Type your answer..."
                autoComplete="off"
              />
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
          
          {feedback.message && (
            <div className={`p-3 rounded-lg ${
              feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {feedback.message}
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={showHintHandler}
            disabled={hintUsed}
            className={`px-4 py-2 rounded-lg ${
              hintUsed ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            Hint (Show Word)
          </button>
          
          <button
            onClick={endGame}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            End Game
          </button>
        </div>
      </div>
      
      {showHint && (
        <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300 text-yellow-800 mb-4">
          <p className="text-center text-lg font-bold">Hint: {currentWord}</p>
        </div>
      )}
      
      <div className="bg-white p-4 rounded-xl shadow-md w-full">
        <h3 className="font-semibold text-gray-700 mb-2">Game Progress:</h3>
        <div className="flex justify-between">
          <p className="text-green-600">Correct: {correctAnswers}</p>
          <p className="text-red-600">Wrong: {wrongAnswers}</p>
        </div>
      </div>
    </div>
  );

  // Render results screen
  const renderResults = () => (
    <div className="flex flex-col items-center w-full max-w-md">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">Game Over!</h2>
        
        <div className="mb-8">
          <p className="text-4xl font-bold text-blue-600 mb-2">{score}</p>
          <p className="text-gray-600">Final Score</p>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
              <p className="text-gray-600">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{wrongAnswers}</p>
              <p className="text-gray-600">Wrong</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100) || 0}%</p>
              <p className="text-gray-600">Accuracy</p>
            </div>
          </div>
        </div>
        
        {score > highScore && (
          <div className="p-4 bg-yellow-100 rounded-lg mb-8">
            <p className="text-yellow-800 font-bold">New High Score!</p>
          </div>
        )}
        
        <div className="flex gap-4">
          <button
            onClick={() => setGameMode('menu')}
            className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors"
          >
            Main Menu
          </button>
          <button
            onClick={startGame}
            className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      {gameMode === 'menu' && renderMenu()}
      {gameMode === 'play' && renderGame()}
      {gameMode === 'result' && renderResults()}
    </div>
  );
};

export default FingerspellingChallenge;