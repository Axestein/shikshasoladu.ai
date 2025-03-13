import React from "react";
import { Link } from "react-router-dom";
import { Home, BarChart2, Clipboard, Eye, Award, Users, Settings } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-indigo-700 p-4 shadow-lg">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold flex items-center gap-2">
          <span className="text-yellow-300">Shiksha</span>Soladu.ai
        </Link>
        
        <ul className="flex flex-wrap gap-4 md:gap-6 items-center">
          <li>
            <Link to="/deaf" className="text-white hover:text-yellow-300 flex items-center gap-1 transition duration-300">
              <Home size={18} />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard-deaf" className="text-white hover:text-yellow-300 flex items-center gap-1 transition duration-300">
              <BarChart2 size={18} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/signlang" className="text-white hover:text-yellow-300 flex items-center gap-1 transition duration-300">
              <Clipboard size={18} />
              <span>Sign Language</span>
            </Link>
          </li>
          <li>
            <Link to="/visual-learning" className="text-white hover:text-yellow-300 flex items-center gap-1 transition duration-300">
              <Eye size={18} />
              <span>Visual Learning</span>
            </Link>
          </li>
          <li>
            <Link to="/gamification-deaf" className="text-white hover:text-yellow-300 flex items-center gap-1 transition duration-300">
              <Award size={18} />
              <span>Gamification</span>
            </Link>
          </li>
          <li>
            <Link to="/community-deaf" className="text-white hover:text-yellow-300 flex items-center gap-1 transition duration-300">
              <Users size={18} />
              <span>Community</span>
            </Link>
          </li>
          <li>
            <Link to="/accessibility" className="text-white hover:text-yellow-300 flex items-center gap-1 transition duration-300">
              <Settings size={18} />
              <span>Accessibility</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}