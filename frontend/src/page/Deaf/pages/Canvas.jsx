import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs"; // Import TensorFlow.js
import targetImage from "../assets/target-image.jpg"; // Correct image import
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const CanvasDraw = () => {
  const canvasRef = useRef(null); // Reference to the canvas element
  const [isDrawing, setIsDrawing] = useState(false); // Track drawing state
  const [brushColor, setBrushColor] = useState("#FFFFFF"); // Default brush color (white)
  const [brushSize, setBrushSize] = useState(5); // Brush size
  const [points, setPoints] = useState(0); // Points earned by the user
  const [model, setModel] = useState(null); // TensorFlow.js model

  // Load TensorFlow.js model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel("/models/model.json"); // Correct path to model
        console.log("Model loaded successfully!");
        setModel(loadedModel);
      } catch (error) {
        console.error("Failed to load model:", error);
      }
    };
    loadModel();
  }, []);

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

  // Function to preprocess images for the AI model
  const preprocessImage = (image) => {
    return tf.browser.fromPixels(image) // Convert image to tensor
      .resizeNearestNeighbor([224, 224]) // Resize to model input size
      .toFloat() // Convert to float
      .div(tf.scalar(255)) // Normalize pixel values
      .expandDims(); // Add batch dimension
  };

  // Function to check accuracy using AI
  const checkAccuracy = async () => {
    if (!model) {
      alert("Model is not loaded yet. Please wait.");
      return;
    }

    const canvas = canvasRef.current;
    const targetImg = document.getElementById("target-image");

    // Preprocess both images
    const userDrawing = preprocessImage(canvas);
    const target = preprocessImage(targetImg);

    // Get predictions from the model
    const userPrediction = await model.predict(userDrawing).data();
    const targetPrediction = await model.predict(target).data();

    // Calculate similarity score (e.g., cosine similarity)
    const similarity = cosineSimilarity(userPrediction, targetPrediction);

    // Award points based on similarity
    const earnedPoints = Math.floor(similarity * 10); // Scale similarity to points
    setPoints((prev) => prev + earnedPoints);

    // Provide feedback
    alert(`Great job! You earned ${earnedPoints} points.`);
  };

  // Function to calculate cosine similarity
  const cosineSimilarity = (a, b) => {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col ml-64"> {/* ml-64 to offset for sidebar width */}
        {/* Navbar */}
        <Navbar />

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
                id="target-image"
                src={targetImage} // Correct usage of the imported target image
                alt="Target"
                className="w-96 h-96 object-contain"
              />
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
      </div>
    </div>
  );
};

export default CanvasDraw;