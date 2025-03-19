import React, { useEffect, useRef, useState } from "react";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignAuth() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detectedSequence, setDetectedSequence] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [handDetected, setHandDetected] = useState(false);
  const [letterRecognized, setLetterRecognized] = useState("");
  const [progressPercentage, setProgressPercentage] = useState(0);
  const navigate = useNavigate();
  const predefinedPassword = "AB";
  let lastDetectedLetter = "";

  useEffect(() => {
    if (!videoRef.current || !isAuthenticating) return;

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
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      setHandDetected(results.multiHandLandmarks && results.multiHandLandmarks.length > 0);

      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawLandmarks(ctx, landmarks);
          const letter = detectSignLanguageLetter(landmarks);

          if (letter) {
            setLetterRecognized(letter);
            if (letter !== lastDetectedLetter) {
              setDetectedSequence((prev) => {
                const newSequence = prev + letter;
                // Update progress percentage
                setProgressPercentage(
                  (newSequence.length / predefinedPassword.length) * 100 > 100
                    ? 100
                    : (newSequence.length / predefinedPassword.length) * 100
                );
                return newSequence;
              });
              lastDetectedLetter = letter;
            }
          }
        }
      } else {
        setLetterRecognized("");
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 480,
      height: 360,
    });

    camera.start();

    return () => {
      camera.stop();
    };
  }, [isAuthenticating]);

  useEffect(() => {
    if (detectedSequence.endsWith(predefinedPassword)) {
      setIsAuthenticating(false);
      toast.success("Authentication Successful! Redirecting... 🎉", {
        position: "top-center",
        autoClose: 2000,
      });
      setTimeout(() => navigate("/deaf"), 2000);
    }
  }, [detectedSequence, navigate]);

  const drawLandmarks = (ctx, landmarks) => {
    // Draw hand points
    ctx.fillStyle = "rgba(0, 120, 255, 0.8)";
    for (const landmark of landmarks) {
      ctx.beginPath();
      ctx.arc(
        landmark.x * canvasRef.current.width,
        landmark.y * canvasRef.current.height,
        4,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }

    // Draw hand connections with gradient
    for (const [start, end] of HAND_CONNECTIONS) {
      const startX = landmarks[start].x * canvasRef.current.width;
      const startY = landmarks[start].y * canvasRef.current.height;
      const endX = landmarks[end].x * canvasRef.current.width;
      const endY = landmarks[end].y * canvasRef.current.height;
      
      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      gradient.addColorStop(0, "rgba(0, 180, 255, 0.8)");
      gradient.addColorStop(1, "rgba(0, 120, 255, 0.8)");
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  };

  const detectSignLanguageLetter = (landmarks) => {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    if (thumbTip.y < indexTip.y && thumbTip.y < middleTip.y) return "A";
    if (thumbTip.y > indexTip.y && indexTip.y < middleTip.y) return "B";
    return "";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Hand Sign Authentication</h2>
        <p className="text-gray-500 mb-6 text-center">Use sign language to authenticate</p>
        
        <div className="relative rounded-xl overflow-hidden bg-gray-50 shadow-inner mb-6">
          <video 
            ref={videoRef} 
            className="w-full h-auto rounded-xl" 
            autoPlay 
            playsInline
          ></video>
          <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full" 
            width={480} 
            height={360}
          ></canvas>
          
          {/* Status indicator */}
          <div className="absolute top-4 right-4">
            <div className={`flex items-center rounded-full px-3 py-1 text-xs font-medium ${handDetected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${handDetected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              {handDetected ? 'Hand Detected' : 'No Hand'}
            </div>
          </div>
          
          {/* Current letter indicator */}
          {letterRecognized && (
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold text-blue-600 shadow-md">
              {letterRecognized}
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        {/* Detected sequence with visual styling */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Detected Sequence:</p>
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg min-h-10">
            {detectedSequence.split('').map((letter, index) => (
              <span 
                key={index} 
                className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-lg font-medium"
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      
        
        {/* Helper text */}
        <p className="text-xs text-gray-400 text-center">
          Position your hand clearly in the frame for better recognition
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}