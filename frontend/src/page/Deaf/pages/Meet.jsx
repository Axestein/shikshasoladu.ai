import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Meet = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [peer, setPeer] = useState(null);

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
          localVideoRef.current.srcObject = stream;
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
          });
        });
    });

    return () => {
      peer.destroy(); // Clean up on unmount
    };
  }, []);

  const callPeer = () => {
    if (!remotePeerId) return;

    // Call the remote peer
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        const call = peer.call(remotePeerId, stream);
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
      });
  };

  return (
    <div className="flex flex-col ml-40 items-center justify-center h-screen bg-gray-100">
      <Sidebar />
      <Navbar />
      <h1 className="text-3xl font-bold text-blue-600 mb-8">Meet with Peers</h1>

      {/* Video Streams */}
      <div className="flex space-x-4 mb-8">
        <video ref={localVideoRef} autoPlay muted className="w-96 h-64 bg-black rounded-xl"></video>
        <video ref={remoteVideoRef} autoPlay className="w-96 h-64 bg-black rounded-xl"></video>
      </div>

      {/* Peer ID Input */}
      <div className="flex space-x-4 mb-8">
        <input
          type="text"
          placeholder="Enter Remote Peer ID"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={callPeer}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Call Peer
        </button>
      </div>

      {/* Local Peer ID */}
      <p className="text-gray-700">Your Peer ID: {peerId}</p>
    </div>
  );
};

export default Meet;

{/* insane UI version 
import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Mic, MicOff, Video, VideoOff, MessageSquare, Users, ClosedCaptions, Settings, Share2, X } from "lucide-react";

const Meet = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [peer, setPeer] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [captions, setCaptions] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [stream, setStream] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Initialize PeerJS
  useEffect(() => {
    const newPeer = new Peer({
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478" },
        ],
      },
    });

    setPeer(newPeer);

    // Set local peer ID
    newPeer.on("open", (id) => {
      setPeerId(id);
    });

    // Handle incoming call
    newPeer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          setStream(mediaStream);
          localVideoRef.current.srcObject = mediaStream;
          call.answer(mediaStream);
          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            setIsConnected(true);
          });
        })
        .catch((err) => {
          console.error("Failed to get media stream:", err);
        });
    });

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      newPeer.destroy();
    };
  }, []);

  // Call a remote peer
  const callPeer = () => {
    if (!remotePeerId) return;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        localVideoRef.current.srcObject = mediaStream;
        const call = peer.call(remotePeerId, mediaStream);
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          setIsConnected(true);
        });
      })
      .catch((err) => {
        console.error("Failed to get media stream:", err);
      });
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // Toggle video on/off
  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  // Toggle captions
  const toggleCaptions = () => {
    setCaptions(!captions);
  };

  // Toggle chat
  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  // Send a chat message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      text: message,
      sender: "You",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  // Copy meeting link to clipboard
  const copyMeetingLink = () => {
    navigator.clipboard.writeText(peerId);
    alert("Meeting ID copied to clipboard");
    setShowInviteModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        <main className="flex flex-col flex-1 overflow-hidden p-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-blue-700">Visual Learning Session</h1>

              {isConnected && (
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
              )}
            </div>

            <div className="flex flex-1 overflow-hidden gap-4">
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="relative flex-1 bg-gray-900 rounded-xl overflow-hidden mb-4">
                  {isConnected ? (
                    <video ref={remoteVideoRef} autoPlay className="w-full h-full object-cover"></video>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <Users size={64} className="mb-4 text-gray-400" />
                      <p className="text-xl font-medium">Waiting for connection...</p>
                      <p className="text-gray-400 mt-2">Share your meeting ID to invite someone</p>
                    </div>
                  )}

                  {captions && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-3 text-white text-center">
                      <p>Live captions will appear here when speech is detected</p>
                    </div>
                  )}
                </div>

                <div className="h-36 relative bg-gray-800 rounded-xl overflow-hidden">
                  <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover"></video>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded-lg text-white text-sm">
                    You
                  </div>
                </div>
              </div>

              {chatOpen && (
                <div className="w-80 bg-white rounded-xl border border-gray-200 flex flex-col">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-medium">Chat</h3>
                    <button onClick={toggleChat} className="text-gray-500 hover:text-gray-700">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {messages.length === 0 ? (
                      <p className="text-gray-400 text-center">No messages yet</p>
                    ) : (
                      messages.map((msg, index) => (
                        <div key={index} className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}>
                          <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender === "You" ? "bg-blue-100" : "bg-gray-100"}`}>
                            <p>{msg.text}</p>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">{msg.sender} • {msg.time}</span>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={sendMessage} className="p-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button type="submit" className="bg-blue-600 text-white rounded-lg px-3 py-2 hover:bg-blue-700">
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {!isConnected && (
              <div className="bg-blue-50 rounded-xl p-4 mt-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-blue-800">Start a meeting</h3>
                    <p className="text-blue-600">Enter a Peer ID to connect with someone</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Enter Remote Peer ID"
                      value={remotePeerId}
                      onChange={(e) => setRemotePeerId(e.target.value)}
                      className="p-2 border border-blue-300 rounded-lg"
                    />
                    <button
                      onClick={callPeer}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Connect
                    </button>
                  </div>
                </div>

                <div className="flex items-center mt-4 pt-4 border-t border-blue-200">
                  <div className="text-blue-700 mr-3">Your Meeting ID:</div>
                  <div className="bg-white px-3 py-1 rounded-lg border border-blue-300 font-mono">{peerId}</div>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="ml-auto text-blue-700 hover:text-blue-900 flex items-center"
                  >
                    <Share2 size={16} className="mr-1" />
                    Share
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-3 p-4 bg-gray-100 rounded-xl">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full ${isMuted ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-700"} hover:bg-opacity-80`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full ${isVideoOff ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-700"} hover:bg-opacity-80`}
                title={isVideoOff ? "Turn video on" : "Turn video off"}
              >
                {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
              </button>

              <button
                onClick={toggleCaptions}
                className={`p-3 rounded-full ${captions ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-700"} hover:bg-opacity-80`}
                title={captions ? "Turn off captions" : "Turn on captions"}
              >
                <ClosedCaptions size={24} />
              </button>

              <button
                onClick={toggleChat}
                className={`p-3 rounded-full ${chatOpen ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-700"} hover:bg-opacity-80`}
                title={chatOpen ? "Close chat" : "Open chat"}
              >
                <MessageSquare size={24} />
              </button>

              <button
                className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-opacity-80"
                title="Settings"
              >
                <Settings size={24} />
              </button>
            </div>
          </div>
        </main>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Share meeting invitation</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <p className="mb-4">Share this meeting ID with the person you want to meet with:</p>

            <div className="flex items-center bg-gray-100 p-3 rounded-lg mb-4">
              <span className="font-mono flex-1">{peerId}</span>
              <button
                onClick={copyMeetingLink}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm"
              >
                Copy
              </button>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowInviteModal(false)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meet;
 */}