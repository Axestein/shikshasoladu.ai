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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Badges</h2>
      <div className="grid grid-cols-3 gap-4">
        {badges.map((badge, index) => (
          <div key={index} className="text-center">
            {badge === "Gold" && <FaTrophy className="text-6xl text-yellow-400 mx-auto" />}
            {badge === "Silver" && <FaMedal className="text-6xl text-gray-400 mx-auto" />}
            {badge === "Bronze" && <FaAward className="text-6xl text-yellow-600 mx-auto" />}
            <span className="text-gray-700">{badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}