import React, { useState } from 'react';
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS

const initializePuzzle = () => {
  // Initialize your puzzle state here
  return {
    // Example puzzle state with coding challenges
    challenges: [
      {
        id: 1,
        title: 'Reverse a String',
        description: 'Write a function to reverse a string.',
        code: `function reverseString(str) {\n  // Your code here\n}`,
        solution: `function reverseString(str) {\n  return str.split('').reverse().join('');\n}`,
        solved: false,
      },
      {
        id: 2,
        title: 'Find the Maximum',
        description: 'Write a function to find the maximum number in an array.',
        code: `function findMax(arr) {\n  // Your code here\n}`,
        solution: `function findMax(arr) {\n  return Math.max(...arr);\n}`,
        solved: false,
      },
    ],
  };
};

const PuzzleGame = () => {
  const [puzzleState, setPuzzleState] = useState(initializePuzzle());
  const [hintVisible, setHintVisible] = useState(false);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);

  const handleCodeChange = (id, newCode) => {
    setPuzzleState((prevState) => ({
      ...prevState,
      challenges: prevState.challenges.map((challenge) =>
        challenge.id === id ? { ...challenge, code: newCode } : challenge
      ),
    }));
  };

  const checkSolution = (id) => {
    const challenge = puzzleState.challenges.find((challenge) => challenge.id === id);
    if (challenge.code.trim() === challenge.solution.trim()) {
      setPuzzleState((prevState) => ({
        ...prevState,
        challenges: prevState.challenges.map((challenge) =>
          challenge.id === id ? { ...challenge, solved: true } : challenge
        ),
      }));
      alert('Correct!');
    } else {
      alert('Try again!');
    }
  };

  const showHint = () => {
    setHintVisible(true);
  };

  const hideHint = () => {
    setHintVisible(false);
  };

  const currentChallenge = puzzleState.challenges[currentChallengeIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Coding Puzzle Game</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">{currentChallenge.title}</h2>
        <p className="mb-4">{currentChallenge.description}</p>
        <textarea
          className="w-full h-40 p-2 border border-gray-300 rounded mb-4"
          value={currentChallenge.code}
          onChange={(e) => handleCodeChange(currentChallenge.id, e.target.value)}
        />
        <button
          onClick={() => checkSolution(currentChallenge.id)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
        >
          Check Solution
        </button>
        <button
          onClick={showHint}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Show Hint
        </button>
        {hintVisible && (
          <div className="mt-4 p-4 bg-white border-2 border-gray-800 rounded">
            <p>Hint: {currentChallenge.solution}</p>
            <button
              onClick={hideHint}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Hide Hint
            </button>
          </div>
        )}
      </div>
      <div className="mt-8 flex space-x-4">
        <button
          onClick={() => setCurrentChallengeIndex(Math.max(currentChallengeIndex - 1, 0))}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          disabled={currentChallengeIndex === 0}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentChallengeIndex(Math.min(currentChallengeIndex + 1, puzzleState.challenges.length - 1))}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          disabled={currentChallengeIndex === puzzleState.challenges.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PuzzleGame;
