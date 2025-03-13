import React from "react";
import { FaChartBar, FaImage, FaFilm } from "react-icons/fa";

export default function VisualAids() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Visual Aids (Infographics, Diagrams, Animations)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <FaChartBar className="text-6xl text-blue-600 mx-auto" />
          <h3 className="text-xl font-semibold mt-2">Infographics</h3>
          <p className="text-gray-700">
            Learn through visually appealing infographics.
          </p>
        </div>
        <div className="text-center">
          <FaImage className="text-6xl text-blue-600 mx-auto" />
          <h3 className="text-xl font-semibold mt-2">Diagrams</h3>
          <p className="text-gray-700">
            Understand concepts with detailed diagrams.
          </p>
        </div>
        <div className="text-center">
          <FaFilm className="text-6xl text-blue-600 mx-auto" />
          <h3 className="text-xl font-semibold mt-2">Animations</h3>
          <p className="text-gray-700">
            Engage with interactive animations.
          </p>
        </div>
      </div>
    </div>
  );
}