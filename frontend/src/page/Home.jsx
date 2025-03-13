import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Welcome to EdTech for Inclusive Education!
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Explore our platforms for Deaf, Blind, and All Users.
        </p>

        {/* Buttons for navigating to different pages */}
        <div className="space-x-4">
          <Link
            to="/deaf"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Deaf Community
          </Link>
          <Link
            to="/blind"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Blind Community
          </Link>
          <Link
            to="/allusers"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            All Users
          </Link>
        </div>
      </div>
    </div>
  );
}
