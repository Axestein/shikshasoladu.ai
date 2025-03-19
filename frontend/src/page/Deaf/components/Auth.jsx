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

      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawLandmarks(ctx, landmarks);
          const letter = detectSignLanguageLetter(landmarks);

          if (letter && letter !== lastDetectedLetter) {
            setDetectedSequence((prev) => prev + letter);
            lastDetectedLetter = letter;
          }
        }
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 320,
      height: 240,
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
    ctx.fillStyle = "#FF0000";
    for (const landmark of landmarks) {
      ctx.beginPath();
      ctx.arc(
        landmark.x * canvasRef.current.width,
        landmark.y * canvasRef.current.height,
        5,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }

    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 2;
    for (const [start, end] of HAND_CONNECTIONS) {
      ctx.beginPath();
      ctx.moveTo(
        landmarks[start].x * canvasRef.current.width,
        landmarks[start].y * canvasRef.current.height
      );
      ctx.lineTo(
        landmarks[end].x * canvasRef.current.width,
        landmarks[end].y * canvasRef.current.height
      );
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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Sign Authentication</h2>
      <div className="relative">
        <video ref={videoRef} className="w-80 h-auto rounded-lg" autoPlay playsInline></video>
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" width={320} height={240}></canvas>
      </div>
      <p className="mt-4 text-gray-700">Detected Sequence: {detectedSequence}</p>
      <ToastContainer />
    </div>
  );
}
