// Layout.jsx
import React from "react";
import Sidebar from "./page/Deaf/components/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100"> {/* Add background color and set height */}
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="ml-64 w-full p-6 bg-white bg-opacity-90 shadow-lg rounded-lg">
        {/* Children (page content) */}
        {children}
      </div>
    </div>
  );
}
