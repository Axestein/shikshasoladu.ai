import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  BarChart2,
  Clipboard,
  Eye,
  Award,
  Users,
  Settings,
  UserCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users as UsersIcon, // Use a different alias for Users to avoid conflict
} from "lucide-react"; // Added ChevronDown and ChevronUp icons for dropdown toggle

export default function Sidebar() {
  const [isGamificationOpen, setIsGamificationOpen] = useState(false); // State to track the dropdown toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to toggle sidebar open/close

  const toggleGamificationDropdown = () => {
    setIsGamificationOpen(!isGamificationOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar
  };

  return (
    <div className={`bg-indigo-700 h-full fixed top-0 left-0 z-50 transition-all ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-6 flex justify-between">
        <Link to="/" className={`text-white text-2xl font-bold flex items-center gap-2 ${isSidebarOpen ? '' : 'justify-center'}`}>
          <span className="text-yellow-300">Shiksha</span>Soladu.ai
        </Link>
        <button onClick={toggleSidebar} className="text-white">
          {isSidebarOpen ? (
            <ChevronLeft size={24} /> // Icon for closing the sidebar
          ) : (
            <ChevronRight size={24} /> // Icon for opening the sidebar
          )}
        </button>
      </div>

      <ul className="mt-0 space-y-4">
        <li>
          <Link to="/deaf" className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2">
            <Home size={18} />
            {isSidebarOpen && <span>Home</span>}
          </Link>
        </li>
        <li>
          <Link to="/dashboard-deaf" className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2">
            <BarChart2 size={18} />
            {isSidebarOpen && <span>Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link to="/signlang" className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2">
            <Clipboard size={18} />
            {isSidebarOpen && <span>Sign Language</span>}
          </Link>
        </li>
        <li>
          <Link to="/visual-learning" className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2">
            <Eye size={18} />
            {isSidebarOpen && <span>Visual Learning</span>}
          </Link>
        </li>

        {/* Gamification Dropdown */}
        <li>
          <button
            onClick={toggleGamificationDropdown}
            className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2 w-full text-left"
          >
            <Award size={18} />
            {isSidebarOpen && <span>Gamification</span>}
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
                  {isSidebarOpen && <span>Canvas</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/signgame"
                  className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2"
                >
                  {isSidebarOpen && <span>Sign Game</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/gamification-deaf"
                  className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2"
                >
                  {isSidebarOpen && <span>Games</span>}
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <Link to="/community-deaf" className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2">
            <UsersIcon size={18} />
            {isSidebarOpen && <span>Community</span>}
          </Link>
        </li>

        {/* Plan Your Day and Meet with Peers */}
        <li>
          <Link to="/deaf-meet" className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2">
            <UsersIcon size={18} />
            {isSidebarOpen && <span>Meet with peers</span>}
          </Link>
        </li>
        <li>
          <Link to="/deaf-planyourday" className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2">
            <Calendar size={18} /> {/* Icon for Plan Your Day */}
            {isSidebarOpen && <span>Plan Your Day</span>}
          </Link>
        </li>

        <li>
          <Link to="/accessibility" className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2">
            <Settings size={18} />
            {isSidebarOpen && <span>Accessibility</span>}
          </Link>
        </li>
        <li>
          <Link to="/dprofile" className="text-white hover:text-yellow-300 flex items-center gap-2 transition duration-300 px-6 py-2">
            <UserCircle size={18} />
            {isSidebarOpen && <span>Profile</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
}
