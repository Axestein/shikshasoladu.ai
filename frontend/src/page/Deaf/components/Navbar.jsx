import React from "react";
import { Link } from "react-router-dom";
import { Search, User } from "lucide-react";  // Import Search and User icons

export default function Navbar() {
  return (
    <nav className="bg-indigo-700 p-4 shadow-lg fixed w-full z-10 top-0 left-0">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Left Side: You can add your left-side content here, like logo or links */}
        <div className="flex items-center">
          {/* Add content on the left if needed */}
        </div>

        {/* Right Side - Search Box and Profile Icon */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Search Box */}
          <div className="flex items-center bg-white p-2 rounded-lg shadow-md max-w-xs">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="ml-2 w-full bg-transparent outline-none text-gray-700"
            />
          </div>

          {/* Profile Icon */}
          <Link to="/dprofile">
            <span className="flex items-center">
              <User size={24} className="text-white hover:text-yellow-300 cursor-pointer" />
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
