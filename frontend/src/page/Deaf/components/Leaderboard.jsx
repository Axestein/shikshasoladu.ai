import React, { useState, useEffect } from "react";
import 'tailwindcss/tailwind.css'; 

const mockData = [
  { name: "Alice Johnson", score: 1500 },
  { name: "Bob Smith", score: 1200 },
  { name: "Charlie Brown", score: 1000 },
  { name: "Diana Prince", score: 800 },
  { name: "Ethan Hunt", score: 600 }
];

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Simulate fetching leaderboard data
    const data = JSON.parse(localStorage.getItem("leaderboard")) || mockData;
    setLeaderboard(data);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto mt-10 transform transition-transform duration-300 hover:scale-105">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Leaderboard</h2>
      <div className="space-y-4">
        {leaderboard.map((entry, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
          >
            <div className="flex items-center space-x-4">
              <span className="text-gray-800 font-semibold">{index + 1}.</span>
              <span className="text-gray-800">{entry.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-800 font-semibold">{entry.score}</span>
              <span className="text-gray-500">points</span>
              {index === 0 && (
                <span className="text-yellow-500 font-bold">🏆</span>
              )}
              {index === 1 && (
                <span className="text-gray-500 font-bold">🥈</span>
              )}
              {index === 2 && (
                <span className="text-orange-500 font-bold">🥉</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
