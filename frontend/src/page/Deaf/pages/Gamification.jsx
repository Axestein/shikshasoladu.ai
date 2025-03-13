import React from "react";
import PuzzleGame from "../components/PuzzleGame";
import Leaderboard from "../components/Leaderboard";
import Badges from "../components/Badges";
import Navbar from "../components/Navbar";

export default function Gamification() {
  return (
    <div>
    <Navbar />
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Gamification</h1>
      <div className="space-y-8">
        <PuzzleGame />
        <Leaderboard />
        <Badges />
      </div>
    </div>
    </div>
  );
}