import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, BarChart2, Clipboard, Eye, Award, Users, Settings, UserCircle, ChevronDown, ChevronUp } from "lucide-react"; // Added ChevronDown and ChevronUp icons for dropdown toggle

export default function Sidebar() {
  const [isGamificationOpen, setIsGamificationOpen] = useState(false); // State to track the dropdown toggle

  const toggleGamificationDropdown = () => {
    setIsGamificationOpen(!isGamificationOpen);
  };

  return (
    <div className="bg-indigo-700 w-64 h-full fixed top-0 left-0 z-50">
      <div className="p-6">
        <Link to="/" className="text-white text-2xl font-bold flex items-center gap-2">
          <span className="text-yellow-300">Shiksha</span>Soladu.ai
        </Link>
      </div>
      <ul className="mt-8 space-y-4">
        <li>
          <Link to="/deaf" className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2">
            <Home size={18} />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard-deaf" className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2">
            <BarChart2 size={18} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/signlang" className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2">
            <Clipboard size={18} />
            <span>Sign Language</span>
          </Link>
        </li>
        <li>
          <Link to="/visual-learning" className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2">
            <Eye size={18} />
            <span>Visual Learning</span>
          </Link>
        </li>

        {/* Gamification Dropdown */}
        <li>
          <button
            onClick={toggleGamificationDropdown}
            className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2 w-full text-left"
          >
            <Award size={18} />
            <span>Gamification</span>
            {isGamificationOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />} {/* Toggle Icon */}
          </button>

          {/* Dropdown Links */}
          {isGamificationOpen && (
            <ul className="ml-6 mt-2 space-y-2">
              <li>
                <Link
                  to="/canvas"
                  className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2"
                >
                  <span>Canvas</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/signgame"
                  className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2"
                >
                  <span>Sign Game</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/gamification-deaf"
                  className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2"
                >
                  <span>Games</span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <Link to="/community-deaf" className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2">
            <Users size={18} />
            <span>Community</span>
          </Link>
        </li>
        <li>
          <Link to="/accessibility" className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2">
            <Settings size={18} />
            <span>Accessibility</span>
          </Link>
        </li>
        <li>
          <Link to="/dprofile" className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2">
            <UserCircle size={18} /> {/* Replaced Settings icon with UserCircle */}
            <span>Profile</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
