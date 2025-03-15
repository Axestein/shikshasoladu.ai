import React, { useState, useEffect } from "react";
import { FaTrophy, FaMedal, FaAward } from "react-icons/fa";

export default function Badges() {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    // Simulate fetching badge data
    const data = JSON.parse(localStorage.getItem("badges")) || [];
    setBadges(data);
  }, []);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
        Achievements
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-sm transition-transform transform hover:scale-105"
          >
            {badge === "Gold" && (
              <FaTrophy className="text-7xl text-yellow-500 mb-2" />
            )}
            {badge === "Silver" && (
              <FaMedal className="text-7xl text-gray-500 mb-2" />
            )}
            {badge === "Bronze" && (
              <FaAward className="text-7xl text-orange-600 mb-2" />
            )}
            <span className="text-gray-800 font-semibold">{badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
