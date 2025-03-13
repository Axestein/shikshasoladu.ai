import React, { useState, useEffect } from "react";

const images = [
  "https://via.placeholder.com/100",
  "https://via.placeholder.com/100",
  "https://via.placeholder.com/100",
  "https://via.placeholder.com/100",
];

export default function PuzzleGame() {
  const [puzzle, setPuzzle] = useState([]);
  const [selected, setSelected] = useState([]);
  const [solved, setSolved] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Duplicate images to create pairs
    const puzzleImages = [...images, ...images].sort(() => Math.random() - 0.5);
    setPuzzle(puzzleImages);
  }, []);

  const handleClick = (index) => {
    if (selected.length === 1 && selected[0] === index) return; // Prevent double-click
    setSelected([...selected, index]);

    if (selected.length === 1) {
      const firstIndex = selected[0];
      const secondIndex = index;

      if (puzzle[firstIndex] === puzzle[secondIndex]) {
        setSolved([...solved, firstIndex, secondIndex]);
        setScore(score + 10);
      }

      setTimeout(() => setSelected([]), 500); // Reset selection after 500ms
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Puzzle Game</h2>
      <p className="text-gray-700 mb-4">
        Match the pairs of images to earn points!
      </p>
      <div className="grid grid-cols-4 gap-4">
        {puzzle.map((image, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={`cursor-pointer p-4 border rounded-lg ${
              selected.includes(index) || solved.includes(index)
                ? "border-blue-600"
                : "border-gray-200"
            }`}
          >
            {(selected.includes(index) || solved.includes(index)) && (
              <img src={image} alt="Puzzle piece" className="w-full h-auto" />
            )}
          </div>
        ))}
      </div>
      <p className="text-gray-700 mt-4">Score: {score}</p>
    </div>
  );
}