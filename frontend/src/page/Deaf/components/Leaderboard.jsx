import React, { useState, useEffect } from "react";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Simulate fetching leaderboard data
    const data = JSON.parse(localStorage.getItem("leaderboard")) || [];
    setLeaderboard(data);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Leaderboard</h2>
      <div className="space-y-2">
        {leaderboard.map((entry, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-gray-700">{entry.name}</span>
            <span className="text-gray-700">{entry.score} points</span>
          </div>
        ))}
      </div>
    </div>
  );
}