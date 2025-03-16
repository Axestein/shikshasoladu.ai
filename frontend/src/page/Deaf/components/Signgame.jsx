import React, { useEffect, useRef, useState } from "react";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import handscan from "../assets/handscan.jpg";

export default function SignLanguageGame() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detectedLetter, setDetectedLetter] = useState("");
  const [targetLetter, setTargetLetter] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // 10-second timer
  const [isGameActive, setIsGameActive] = useState(false); // Game starts inactive
  const [isLoading, setIsLoading] = useState(true); // Loading screen state

  // Generate a random letter (A-Z)
  const generateRandomLetter = () => {
    const letters = "ABDEIH";
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    setTargetLetter(randomLetter);
  };

  // Initialize the game
  useEffect(() => {
    if (isGameActive) {
      generateRandomLetter();
    }
  }, [isGameActive]);

  // Timer logic
  useEffect(() => {
    if (!isGameActive || timeLeft === 0) {
      setIsGameActive(false); // End the game
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isGameActive]);

  // Check if the detected letter matches the target letter
  useEffect(() => {
    if (detectedLetter === targetLetter && isGameActive) {
      setScore((prevScore) => prevScore + 1);
      generateRandomLetter(); // Generate a new letter
      setTimeLeft(10); // Reset the timer
    }
  }, [detectedLetter, targetLetter, isGameActive]);

  // Hand detection logic
  useEffect(() => {
    if (!videoRef.current || !isGameActive) {
      return;
    }

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw hand landmarks
      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawLandmarks(ctx, landmarks);
          const letter = detectSignLanguageLetter(landmarks);
          setDetectedLetter(letter);
        }
      }
    });

    // Initialize the camera
    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 320, // Smaller window size
      height: 240,
    });

    camera.start();

    // Cleanup
    return () => {
      camera.stop();
    };
  }, [isGameActive]);

  // Function to draw hand landmarks on the canvas
  const drawLandmarks = (ctx, landmarks) => {
    ctx.fillStyle = "#FF0000";
    for (const landmark of landmarks) {
      ctx.beginPath();
      ctx.arc(landmark.x * canvasRef.current.width, landmark.y * canvasRef.current.height, 5, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw connections between landmarks
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 2;
    for (const [start, end] of HAND_CONNECTIONS) {
      ctx.beginPath();
      ctx.moveTo(landmarks[start].x * canvasRef.current.width, landmarks[start].y * canvasRef.current.height);
      ctx.lineTo(landmarks[end].x * canvasRef.current.width, landmarks[end].y * canvasRef.current.height);
      ctx.stroke();
    }
  };

  // Function to detect sign language letters based on hand landmarks
  const detectSignLanguageLetter = (landmarks) => {
    const thumbTip = landmarks[4]; // Thumb tip
    const indexTip = landmarks[8]; // Index finger tip
    const middleTip = landmarks[12]; // Middle finger tip
    const ringTip = landmarks[16]; // Ring finger tip
    const pinkyTip = landmarks[20]; // Pinky finger tip

    // Helper function to calculate distance between two points
    const distance = (point1, point2) =>
      Math.hypot(point1.x - point2.x, point1.y - point2.y);

    // Letter "A": Thumb extended, other fingers closed
    if (
      thumbTip.y < indexTip.y &&
      thumbTip.y < middleTip.y &&
      thumbTip.y < ringTip.y &&
      thumbTip.y < pinkyTip.y
    ) {
      return "A";
    }

    // Letter "B": All fingers extended, thumb closed
    if (
      thumbTip.y > indexTip.y &&
      thumbTip.y > middleTip.y &&
      thumbTip.y > ringTip.y &&
      thumbTip.y > pinkyTip.y
    ) {
      return "B";
    }

    // Letter "C": Fingers curved into a "C" shape
    if (
      distance(indexTip, middleTip) < 0.1 &&
      distance(middleTip, ringTip) < 0.1 &&
      distance(ringTip, pinkyTip) < 0.1 &&
      distance(thumbTip, indexTip) > 0.2
    ) {
      return "C";
    }

    // Letter "D": Index finger extended, other fingers closed
    if (
      indexTip.y < thumbTip.y &&
      indexTip.y < middleTip.y &&
      indexTip.y < ringTip.y &&
      indexTip.y < pinkyTip.y
    ) {
      return "D";
    }

    // Letter "E": All fingers curled, thumb across palm
    if (
      distance(indexTip, middleTip) < 0.1 &&
      distance(middleTip, ringTip) < 0.1 &&
      distance(ringTip, pinkyTip) < 0.1 &&
      distance(thumbTip, indexTip) < 0.1
    ) {
      return "E";
    }

    // Letter "F": Thumb and index finger touching, other fingers extended
    if (
      distance(thumbTip, indexTip) < 0.1 &&
      middleTip.y < ringTip.y &&
      middleTip.y < pinkyTip.y
    ) {
      return "F";
    }

    // Letter "G": Index finger pointing, thumb and other fingers closed
    if (
      indexTip.y < thumbTip.y &&
      indexTip.y < middleTip.y &&
      indexTip.y < ringTip.y &&
      indexTip.y < pinkyTip.y &&
      distance(thumbTip, middleTip) < 0.1
    ) {
      return "G";
    }

    // Letter "H": Index and middle fingers extended, other fingers closed
    if (
      indexTip.y < thumbTip.y &&
      middleTip.y < thumbTip.y &&
      ringTip.y > thumbTip.y &&
      pinkyTip.y > thumbTip.y
    ) {
      return "H";
    }

    // Letter "I": Pinky finger extended, other fingers closed
    if (
      pinkyTip.y < thumbTip.y &&
      pinkyTip.y < indexTip.y &&
      pinkyTip.y < middleTip.y &&
      pinkyTip.y < ringTip.y
    ) {
      return "I";
    }

    // Letter "K": Index and middle fingers extended and spread apart, thumb extended
    if (
      indexTip.y < thumbTip.y &&
      middleTip.y < thumbTip.y &&
      distance(indexTip, middleTip) > 0.2
    ) {
      return "K";
    }

    // Letter "L": Thumb and index finger extended, other fingers closed
    if (
      thumbTip.y < middleTip.y &&
      indexTip.y < middleTip.y &&
      middleTip.y > ringTip.y &&
      middleTip.y > pinkyTip.y
    ) {
      return "L";
    }

    // Letter "M": Thumb tucked under three fingers
    if (
      distance(thumbTip, indexTip) < 0.1 &&
      distance(indexTip, middleTip) < 0.1 &&
      distance(middleTip, ringTip) < 0.1
    ) {
      return "M";
    }

    // Letter "N": Thumb tucked under two fingers
    if (
      distance(thumbTip, indexTip) < 0.1 &&
      distance(indexTip, middleTip) < 0.1 &&
      distance(middleTip, ringTip) > 0.2
    ) {
      return "N";
    }

    // Letter "O": Fingers curled into an "O" shape
    if (
      distance(indexTip, thumbTip) < 0.1 &&
      distance(middleTip, thumbTip) < 0.1 &&
      distance(ringTip, thumbTip) < 0.1 &&
      distance(pinkyTip, thumbTip) < 0.1
    ) {
      return "O";
    }

    // Letter "P": Index finger pointing down, thumb extended
    if (
      indexTip.y > thumbTip.y &&
      middleTip.y > thumbTip.y &&
      ringTip.y > thumbTip.y &&
      pinkyTip.y > thumbTip.y
    ) {
      return "P";
    }

    // Letter "Q": Thumb and index finger extended, other fingers closed
    if (
      distance(thumbTip, indexTip) < 0.1 &&
      middleTip.y > thumbTip.y &&
      ringTip.y > thumbTip.y &&
      pinkyTip.y > thumbTip.y
    ) {
      return "Q";
    }

    // Letter "R": Index and middle fingers crossed
    if (
      indexTip.y < thumbTip.y &&
      middleTip.y < thumbTip.y &&
      Math.abs(indexTip.x - middleTip.x) < 0.1
    ) {
      return "R";
    }

    // Letter "S": Fist with thumb over fingers
    if (
      distance(thumbTip, indexTip) < 0.1 &&
      distance(indexTip, middleTip) < 0.1 &&
      distance(middleTip, ringTip) < 0.1 &&
      distance(ringTip, pinkyTip) < 0.1
    ) {
      return "S";
    }

    // Letter "T": Thumb between index and middle fingers
    if (
      distance(thumbTip, indexTip) < 0.1 &&
      distance(thumbTip, middleTip) < 0.1 &&
      ringTip.y > thumbTip.y &&
      pinkyTip.y > thumbTip.y
    ) {
      return "T";
    }

    // Letter "U": Index and middle fingers extended together
    if (
      indexTip.y < thumbTip.y &&
      middleTip.y < thumbTip.y &&
      distance(indexTip, middleTip) < 0.1
    ) {
      return "U";
    }

    // Letter "V": Index and middle fingers extended and spread apart
    if (
      indexTip.y < thumbTip.y &&
      middleTip.y < thumbTip.y &&
      distance(indexTip, middleTip) > 0.2
    ) {
      return "V";
    }

    // Letter "W": Index, middle, and ring fingers extended
    if (
      indexTip.y < thumbTip.y &&
      middleTip.y < thumbTip.y &&
      ringTip.y < thumbTip.y &&
      pinkyTip.y > thumbTip.y
    ) {
      return "W";
    }

    // Letter "X": Index finger bent
    if (
      indexTip.y > middleTip.y &&
      middleTip.y < ringTip.y &&
      middleTip.y < pinkyTip.y
    ) {
      return "X";
    }

    // Letter "Y": Thumb and pinky extended, other fingers closed
    if (
      thumbTip.y < indexTip.y &&
      pinkyTip.y < indexTip.y &&
      indexTip.y > middleTip.y &&
      indexTip.y > ringTip.y
    ) {
      return "Y";
    }

    // Letter "Z": Index finger pointing, thumb extended
    if (
      indexTip.y < thumbTip.y &&
      middleTip.y > thumbTip.y &&
      ringTip.y > thumbTip.y &&
      pinkyTip.y > thumbTip.y
    ) {
      return "Z";
    }

    // If no letter is detected
    return "";
  };

  // Start the game
  const startGame = () => {
    setIsLoading(false); // Hide loading screen
    setIsGameActive(true); // Start the game
  };

  return (
    <div className="flex h-screen ml-60 mt-14 bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Loading Screen */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full bg-cyan-950">
            <img src={handscan} alt="Hand Scan" className=" w-full h-3/4 mb-8" />
            <button
              onClick={startGame}
              className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-500 transition duration-300"
            >
              Let's Play a Game
            </button>
          </div>
        )}

        {/* Game Interface */}
        {!isLoading && (
          <div className="ml-10 mt-5 flex flex-grow">
            {/* Left Side: Detected Letter */}
            <div className="w-1/2 p-4 overflow-hidden">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Detected Letter</h2>
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-auto rounded-lg"
                  autoPlay
                  playsInline
                ></video>
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                  width={320}
                  height={240}
                ></canvas>
              </div>
              <p className="text-gray-700 mt-4">
                Detected Letter: <span className="font-bold text-blue-600">{detectedLetter}</span>
              </p>
            </div>

            {/* Right Side: Game Interface */}
            <div className="w-1/2 p-4 bg-white">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Sign Language Game</h2>
              <div className="text-center">
                <p className="text-xl font-semibold mb-4">
                  Show the sign for: <span className="text-4xl font-bold text-green-600">{targetLetter}</span>
                </p>
                <p className="text-gray-700 mb-4">
                  Score: <span className="font-bold text-blue-600">{score}</span>
                </p>
                <p className="text-gray-700 mb-4">
                  Time Left: <span className="font-bold text-red-600">{timeLeft}</span> seconds
                </p>
                {!isGameActive && (
                  <p className="text-red-600 font-bold text-xl">Time's up! Game Over.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}