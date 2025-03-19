import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Meet = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [peer, setPeer] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimer, setCallTimer] = useState(null);

  useEffect(() => {
    const peer = new Peer(); // Create a new Peer instance
    setPeer(peer);

    peer.on("open", (id) => {
      setPeerId(id); // Set the local peer ID
    });

    peer.on("call", (call) => {
      // Answer the call and stream local video
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localStreamRef.current = stream;
          localVideoRef.current.srcObject = stream;
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            setConnected(true);
            startCallTimer();
          });
        });
    });

    return () => {
      if (callTimer) clearInterval(callTimer);
      peer.destroy(); // Clean up on unmount
    };
  }, []);

  const startCallTimer = () => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    setCallTimer(timer);
  };

  const formatCallDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins < 10 && hrs > 0 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const callPeer = () => {
    if (!remotePeerId) return;

    setIsCalling(true);
    // Call the remote peer
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        localVideoRef.current.srcObject = stream;
        const call = peer.call(remotePeerId, stream);
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          setIsCalling(false);
          setConnected(true);
          startCallTimer();
        });
      });
  };

  const copyPeerId = () => {
    navigator.clipboard.writeText(peerId).then(() => {
      setShowCopyNotification(true);
      setTimeout(() => {
        setShowCopyNotification(false);
      }, 2000);
    });
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      remoteVideoRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (callTimer) clearInterval(callTimer);
    setCallDuration(0);
    setConnected(false);
  };

  return (
    <div className="flex flex-col ml-40 items-center justify-center h-screen bg-white">
      <Sidebar />
      <Navbar />
      <div className="relative w-full max-w-6xl flex flex-col items-center z-10">
        <h1 className="text-3xl font-light mb-8 text-gray-800">
          Meet
        </h1>

        {/* Video Streams */}
        <div className="flex flex-wrap justify-center gap-6 mb-6 w-full">
          {/* Local Video */}
          <div className="relative">
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
              <video 
                ref={localVideoRef} 
                autoPlay 
                muted 
                className={`w-80 h-56 object-cover ${isVideoOff ? 'invisible' : ''}`}
              />
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xl text-gray-600">You</span>
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                <button 
                  onClick={toggleMute} 
                  className={`p-2 rounded-full ${isMuted ? 'bg-red-500' : 'bg-white'} shadow-md`}
                >
                  {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  )}
                </button>
                <button 
                  onClick={toggleVideo} 
                  className={`p-2 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-white'} shadow-md`}
                >
                  {isVideoOff ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="absolute top-3 left-3 bg-black bg-opacity-40 px-2 py-1 rounded-md text-xs text-white">
                You
              </div>
            </div>
          </div>
          
          {/* Remote Video */}
          <div className="relative">
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
              <video ref={remoteVideoRef} autoPlay className="w-80 h-56 object-cover" />
              {!connected && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-gray-500">
                    {isCalling ? (
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="text-sm">Connecting...</p>
                      </div>
                    ) : (
                      <p>Waiting for connection</p>
                    )}
                  </div>
                </div>
              )}
              <div className="absolute top-3 left-3 bg-black bg-opacity-40 px-2 py-1 rounded-md text-xs text-white">
                Peer
              </div>
              {connected && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                  <button 
                    onClick={toggleFullscreen} 
                    className="p-2 rounded-full bg-white shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                  </button>
                  <button 
                    onClick={endCall} 
                    className="p-2 rounded-full bg-red-500 shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call duration */}
        {connected && (
          <div className="text-sm text-gray-500 mb-6">
            Call duration: {formatCallDuration(callDuration)}
          </div>
        )}

        {/* Peer ID Input */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full max-w-lg">
          <input
            type="text"
            placeholder="Enter Remote Peer ID"
            value={remotePeerId}
            onChange={(e) => setRemotePeerId(e.target.value)}
            className="p-3 flex-grow border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button
            onClick={callPeer}
            disabled={isCalling || !remotePeerId}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isCalling ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting
              </span>
            ) : (
              "Call"
            )}
          </button>
        </div>

        {/* Local Peer ID with Copy Button */}
        <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3 border border-gray-100">
          <span className="text-gray-500 text-sm">Your ID:</span>
          <code className="font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded text-sm">{peerId}</code>
          <button
            onClick={copyPeerId}
            className="p-2 text-gray-500 hover:text-blue-500 transition duration-200"
            title="Copy Peer ID"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Copy Notification Popup */}
      <div className={`fixed bottom-8 right-8 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 flex items-center ${
        showCopyNotification ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Copied to clipboard
      </div>
    </div>
  );
};

export default Meet;