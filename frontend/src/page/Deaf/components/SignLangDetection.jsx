import React, { useEffect, useRef, useState } from "react";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import atozsignlang from "../assets/atozsignlang.jpg";

export default function SignLanguageDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detectedLetter, setDetectedLetter] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
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
          setIsDetecting(true);
        }
      } else {
        setIsDetecting(false);
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });
    camera.start();

    return () => {
      camera.stop();
    };
  }, []);

  // Function to draw hand landmarks on the canvas
  const drawLandmarks = (ctx, landmarks) => {
    ctx.fillStyle = "#3B82F6";
    for (const landmark of landmarks) {
      ctx.beginPath();
      ctx.arc(landmark.x * canvasRef.current.width, landmark.y * canvasRef.current.height, 4, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw connections between landmarks
    ctx.strokeStyle = "#10B981";
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

  const getLetterStyle = () => {
    return detectedLetter 
      ? "text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse"
      : "text-4xl font-bold text-gray-400";
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center">
        Sign Language Translator
      </h2>
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-3/4 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative rounded-xl overflow-hidden shadow-xl">
            <video
              ref={videoRef}
              className="w-full h-auto rounded-xl"
              autoPlay
              playsInline
            ></video>
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
              width={640}
              height={480}
            ></canvas>
            
            {/* Overlay effect when detecting */}
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none transition-opacity duration-300 ${isDetecting ? 'opacity-100' : 'opacity-0'}`}></div>
          </div>
        </div>

        <div className="w-full md:w-1/4 flex flex-col items-center gap-6">
          <div className="relative group w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative">
              <img
                src={atozsignlang}
                alt="ASL Alphabet Reference"
                className="w-full h-auto rounded-xl shadow-xl object-cover transform transition duration-300 group-hover:scale-[1.02]"
              />
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg w-full text-center transform transition hover:scale-[1.02] duration-300">
            <p className="text-gray-600 mb-2 text-lg">Detected Letter:</p>
            <div className={`${getLetterStyle()} min-h-12 flex items-center justify-center`}>
              {detectedLetter || "—"}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>Show hand signs in front of your camera to translate them into letters</p>
      </div>
    </div>
  );
};