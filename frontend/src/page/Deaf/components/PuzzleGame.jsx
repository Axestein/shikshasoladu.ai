import React, { useState, useEffect } from "react";
import { Trophy, RotateCcw, ChevronRight, Rocket } from "lucide-react";

const DIFFICULTY_LEVELS = {
  EASY: { gridSize: 4, puzzleCount: 6 },
  MEDIUM: { gridSize: 6, puzzleCount: 18 },
  HARD: { gridSize: 8, puzzleCount: 32 }
};

// Categories suitable for children's learning
const CATEGORIES = [
  { name: "Animals", emoji: "🐘" },
  { name: "Fruits", emoji: "🍎" },
  { name: "Colors", emoji: "🌈" },
  { name: "Shapes", emoji: "⭐" },
  { name: "Numbers", emoji: "1️⃣" },
  { name: "Letters", emoji: "🔤" }
];

export default function EnhancedPuzzleGame() {
  const [difficulty, setDifficulty] = useState("EASY");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [puzzle, setPuzzle] = useState([]);
  const [selected, setSelected] = useState([]);
  const [solved, setSolved] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [bestScores, setBestScores] = useState([]);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Generate placeholder images with different colors based on category and level
  const generatePlaceholderImages = (count) => {
    const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "teal", "indigo", "lime"];
    const categoryIndex = CATEGORIES.findIndex(c => c.name === category.name);
    const baseColorIndex = (categoryIndex * level) % colors.length;
    
    return Array.from({ length: count }, (_, i) => {
      const colorIndex = (baseColorIndex + i) % colors.length;
      return `/api/placeholder/100/100?text=${category.emoji}${i+1}&bg=${colors[colorIndex]}`;
    });
  };

  // Initialize or reset game
  const initializeGame = () => {
    const { gridSize, puzzleCount } = DIFFICULTY_LEVELS[difficulty];
    const uniqueImages = generatePlaceholderImages(puzzleCount / 2);
    
    // Duplicate images to create pairs and shuffle
    const puzzleImages = [...uniqueImages, ...uniqueImages]
      .sort(() => Math.random() - 0.5)
      .map((img, index) => ({ id: index, image: img, isFlipped: false }));
    
    setPuzzle(puzzleImages);
    setSelected([]);
    setSolved([]);
    setShowCelebration(false);
    setHintUsed(false);
    setShowHint(false);
    
    if (!gameStarted) {
      setGameStarted(true);
      setScore(0);
    }
    
    setTimerActive(true);
  };

  // Start timer when game begins
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Initialize game on first load and when difficulty/category changes
  useEffect(() => {
    if (gameStarted) {
      initializeGame();
    }
  }, [difficulty, category, level]);

  // Check if all pairs are found
  useEffect(() => {
    const { puzzleCount } = DIFFICULTY_LEVELS[difficulty];
    if (solved.length === puzzleCount && gameStarted) {
      // Level completed
      setTimerActive(false);
      setShowCelebration(true);
      
      // Calculate score based on time, difficulty and hints used
      const timeBonus = Math.max(300 - timer, 0);
      const difficultyMultiplier = difficulty === "EASY" ? 1 : difficulty === "MEDIUM" ? 2 : 3;
      const hintPenalty = hintUsed ? 0.7 : 1;
      const levelScore = Math.floor((solved.length * 5 + timeBonus) * difficultyMultiplier * hintPenalty);
      
      setScore((prevScore) => prevScore + levelScore);
      
      // Save best score
      setBestScores((prev) => {
        const newScores = [...prev, { level, score: levelScore, difficulty }];
        return newScores.sort((a, b) => b.score - a.score).slice(0, 5);
      });
      
      // Reset for next level
      setTimeout(() => {
        setLevel((prevLevel) => prevLevel + 1);
      }, 3000);
    }
  }, [solved, difficulty]);

  // Handle card click
  const handleCardClick = (index) => {
    if (!timerActive || selected.length === 2 || solved.includes(index)) return;
    
    // Update selected cards
    setSelected((prev) => {
      // If card is already selected, return current selection
      if (prev.includes(index)) return prev;
      
      // Add new card to selection
      const newSelection = [...prev, index];
      
      // If two cards selected, check for match
      if (newSelection.length === 2) {
        const [first, second] = newSelection;
        
        // Check if the images match
        if (puzzle[first].image === puzzle[second].image) {
          setTimeout(() => {
            setSolved((prevSolved) => [...prevSolved, first, second]);
          }, 500);
        }
        
        // Clear selection after delay
        setTimeout(() => {
          setSelected([]);
        }, 800);
      }
      
      return newSelection;
    });
  };

  // Show hint (briefly reveal all cards)
  const showHintCards = () => {
    if (hintUsed) return;
    
    setHintUsed(true);
    setShowHint(true);
    
    setTimeout(() => {
      setShowHint(false);
    }, 2000);
  };

  // Format time as MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle starting the game
  const startGame = () => {
    setGameStarted(true);
    setTimer(0);
    setLevel(1);
    setScore(0);
    initializeGame();
  };

  // Next level
  const goToNextLevel = () => {
    setShowCelebration(false);
    setLevel((prev) => prev + 1);
    initializeGame();
  };

  // Render game grid based on difficulty
  const renderGameGrid = () => {
    const { gridSize } = DIFFICULTY_LEVELS[difficulty];
    const gridClass = gridSize === 4 ? "grid-cols-4" : gridSize === 6 ? "grid-cols-6" : "grid-cols-8";
    
    return (
      <div className={`grid ${gridClass} gap-2 w-full max-w-4xl mx-auto`}>
        {puzzle.map((item, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(index)}
            className={`aspect-square flex items-center justify-center cursor-pointer rounded-lg transition-all duration-300 transform hover:scale-105 ${
              selected.includes(index) || solved.includes(index) || showHint
                ? "bg-white shadow-lg rotateY-180"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {(selected.includes(index) || solved.includes(index) || showHint) ? (
              <img 
                src={item.image} 
                alt="Card" 
                className={`w-full h-full object-cover rounded-lg ${solved.includes(index) ? "border-4 border-green-500" : ""}`}
              />
            ) : (
              <span className="text-4xl">❓</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render welcome screen
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-6">Puzzle Game</h1>
          <p className="text-lg text-gray-700 mb-8">Match pairs of cards to complete puzzles and earn points!</p>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Choose Difficulty:</h2>
            <div className="flex justify-center gap-4">
              {Object.keys(DIFFICULTY_LEVELS).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-2 rounded-full ${
                    difficulty === level 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Choose Category:</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full flex items-center ${
                    category.name === cat.name 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <span className="mr-2">{cat.emoji}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={startGame}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full text-xl font-bold flex items-center justify-center mx-auto"
          >
            <Rocket size={24} className="mr-2" />
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-blue-50 p-4">
      {/* Game header */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-4 flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">
            {category.emoji} {category.name} Puzzle - Level {level}
          </h1>
          <p className="text-gray-600">Find all matching pairs!</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="text-center">
            <p className="text-sm text-gray-500">Time</p>
            <p className="text-xl font-mono">{formatTime(timer)}</p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">Score</p>
            <p className="text-xl font-bold text-blue-600">{score}</p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">Pairs</p>
            <p className="text-xl">{solved.length / 2} / {puzzle.length / 2}</p>
          </div>
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 flex items-center justify-center mb-4">
        {showCelebration ? (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-green-600 mb-2">Level Complete!</h2>
            <p className="text-xl mb-4">You found all the pairs!</p>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-lg">Time: <span className="font-bold">{formatTime(timer)}</span></p>
              <p className="text-lg">Total Score: <span className="font-bold text-blue-600">{score}</span></p>
            </div>
            
            <button
              onClick={goToNextLevel}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full text-xl font-bold flex items-center mx-auto"
            >
              Next Level <ChevronRight size={24} className="ml-2" />
            </button>
          </div>
        ) : (
          renderGameGrid()
        )}
      </div>

      {/* Game controls */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={showHintCards}
          disabled={hintUsed}
          className={`px-4 py-2 rounded-full ${
            hintUsed ? "bg-gray-300 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600 text-white"
          }`}
        >
          Show Hint (Once)
        </button>
        
        <button
          onClick={() => initializeGame()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center"
        >
          <RotateCcw size={18} className="mr-2" />
          Restart Level
        </button>
      </div>

      {/* Best scores */}
      {bestScores.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-blue-600 flex items-center mb-2">
            <Trophy size={24} className="mr-2 text-yellow-500" />
            Best Scores
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {bestScores.slice(0, 3).map((entry, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded-lg">
                <p className="font-bold">Level {entry.level} ({entry.difficulty})</p>
                <p className="text-lg text-blue-600">{entry.score} pts</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}