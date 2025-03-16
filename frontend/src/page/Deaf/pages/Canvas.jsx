import React, { useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import canvasintro from "../assets/canvasintro.png"; // Intro image
import targetImage1 from "../assets/target1.jpg"; // Target image 1
import targetImage2 from "../assets/target2.png"; // Target image 2
import targetImage3 from "../assets/target3.png"; // Target image 3
import coinImage from "../assets/coin.png"; // Coin image (download and place in assets folder)

const CanvasDraw = () => {
  const canvasRef = useRef(null); // Reference to the canvas element
  const [isDrawing, setIsDrawing] = useState(false); // Track drawing state
  const [brushColor, setBrushColor] = useState("#FFFFFF"); // Default brush color (white)
  const [brushSize, setBrushSize] = useState(5); // Brush size
  const [points, setPoints] = useState(0); // Points earned by the user
  const [isLoading, setIsLoading] = useState(true); // Loading screen state
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0); // Current target image index
  const [showPointsBox, setShowPointsBox] = useState(false); // Control points box visibility
  const [earnedPoints, setEarnedPoints] = useState(0); // Points earned in the current attempt

  // Array of target images
  const targetImages = [targetImage1, targetImage2, targetImage3];

  // Function to start drawing
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  // Function to draw on the canvas
  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  // Function to stop drawing
  const stopDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.closePath();
    setIsDrawing(false);
  };

  // Function to clear the canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPoints(0); // Reset points when canvas is cleared
  };

  // Function to check accuracy (random rating)
  const checkAccuracy = () => {
    const similarity = Math.random(); // Random similarity score between 0 and 1
    const earnedPoints = Math.floor(similarity * 10); // Scale similarity to points
    setEarnedPoints(earnedPoints); // Store earned points for the popup
    setPoints((prev) => prev + earnedPoints); // Update total points
    setShowPointsBox(true); // Show the points box
  };

  // Function to go to the next target image
  const nextTargetImage = () => {
    setCurrentTargetIndex((prevIndex) => (prevIndex + 1) % targetImages.length);
  };

  // Function to start the game
  const startGame = () => {
    setIsLoading(false); // Hide loading screen
  };

  // Function to close the points box
  const closePointsBox = () => {
    setShowPointsBox(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col ml-64">
        {/* Navbar */}
        <Navbar />

        {/* Loading Intro Screen */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full bg-blue-400">
            <img src={canvasintro} alt="Canvas Intro" className="w-auto h-96 mb-8" />
            <button
              onClick={startGame}
              className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition duration-300"
            >
              Play the Game
            </button>
          </div>
        )}

        {/* Main Game Interface */}
        {!isLoading && (
          <div className="flex-1 p-8 overflow-auto mt-14">
            <h1 className="text-3xl font-bold text-blue-600 mb-8">Gamified Drawing Tool</h1>

            <div className="flex gap-8">
              {/* Canvas */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8 flex-1">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={500}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="border border-gray-300"
                  style={{ backgroundColor: "#000000" }} // Black canvas background
                ></canvas>
              </div>

              {/* Target Image */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Target Image</h2>
                <img
                  src={targetImages[currentTargetIndex]}
                  alt="Target"
                  className="w-96 h-96 object-contain"
                />
                <button
                  onClick={nextTargetImage}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Next Target
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-wrap gap-4">
                {/* Brush Color Picker */}
                <div className="flex items-center space-x-2">
                  <label className="text-gray-700">Brush Color:</label>
                  <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => setBrushColor(e.target.value)}
                    className="w-10 h-10"
                  />
                </div>

                {/* Brush Size Slider */}
                <div className="flex items-center space-x-2">
                  <label className="text-gray-700">Brush Size:</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(e.target.value)}
                    className="w-32"
                  />
                  <span className="text-gray-700">{brushSize}</span>
                </div>

                {/* Clear Canvas Button */}
                <button
                  onClick={clearCanvas}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Clear Canvas
                </button>

                {/* Check Accuracy Button */}
                <button
                  onClick={checkAccuracy}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Check Accuracy
                </button>
              </div>

              {/* Points Display */}
              <div className="mt-4">
                <h3 className="text-xl font-bold text-blue-600">Points Earned: {points}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Points Box Popup */}
        {showPointsBox && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-blue-200 rounded-lg p-6 w-96 text-center">
              <h2 className="text-2xl font-bold text-black mb-4">Great Job!</h2>
              <div className="flex items-center justify-center space-x-2">
                <img src={coinImage} alt="Coin" className="w-20 h-28" />
                <p className="text-xl font-semibold">You earned {earnedPoints} points!</p>
              </div>
              <button
                onClick={closePointsBox}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasDraw;