// Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Home, BarChart2, Clipboard, Eye, Award, Users, Settings } from "lucide-react";

export default function Sidebar() {
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
        <li>
          <Link to="/gamification-deaf" className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2">
            <Award size={18} />
            <span>Gamification</span>
          </Link>
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
      </ul>
    </div>
  );
}
