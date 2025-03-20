import React, { useState, useEffect, useRef } from 'react';
import { MicrophoneIcon, PaperAirplaneIcon, StopIcon } from '@heroicons/react/24/solid';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [robotLoaded, setRobotLoaded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const splineContainerRef = useRef(null);
  const geminiApiKey = "AIzaSyDpfP6qFK6FW8mVzXRXYg2Epomg8Tnvcyc"; 

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  
  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
  }

  useEffect(() => {
    const welcomeMessage = "Welcome to Esmo, how can I help you?";
    setMessages([{ text: welcomeMessage, isUser: false }]);
    speak(welcomeMessage);
    
    // Import Spline script and initialize the viewer
    const scriptId = 'spline-script';
    let script = document.getElementById(scriptId);
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.9.79/build/spline-viewer.js';
      script.onload = () => {
        loadSplineViewer();
      };
      document.body.appendChild(script);
    } else {
      loadSplineViewer();
    }
    
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);
  
  const loadSplineViewer = () => {
    if (!splineContainerRef.current) return;
    
    // Clear any existing content
    splineContainerRef.current.innerHTML = '';
    
    // Create spline-viewer element
    const splineViewer = document.createElement('spline-viewer');
    splineViewer.setAttribute('url', 'https://prod.spline.design/e4TyXNqzxm39b3g0/scene.splinecode');
    splineViewer.style.width = '100%';
    splineViewer.style.height = '100%';
    splineViewer.style.borderRadius = '12px';
    
    // Add loading event listener
    splineViewer.addEventListener('load', () => {
      setRobotLoaded(true);
    });
    
    // Add error event listener
    splineViewer.addEventListener('error', (error) => {
      console.error("Error loading Spline model:", error);
    });
    
    splineContainerRef.current.appendChild(splineViewer);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.keyCode === 32 && !e.repeat) {
        e.preventDefault();
        toggleListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isListening]);

  useEffect(() => {
    if (!recognition) return;

    const handleResult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      setInputText(transcript);
    };

    const handleEnd = () => {
      if (isListening) {
        recognition.start();
      }
    };

    recognition.onresult = handleResult;
    recognition.onend = handleEnd;

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
    };
  }, [isListening]);

  useEffect(() => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.start();
      announceListeningState(true);
    } else {
      recognition.stop();
      if (inputText.trim()) {
        sendMessage();
      }
      announceListeningState(false);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening]);

  const announceListeningState = (isStarting) => {
    speak(isStarting ? "Listening..." : "Stopped listening.");
  };

  const toggleListening = () => {
    setIsListening(prev => !prev);
  };

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetchGeminiResponse(userMessage);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
      speak(response);
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage = "Sorry, I couldn't process your request. Please try again.";
      setMessages(prev => [...prev, { text: errorMessage, isUser: false }]);
      speak(errorMessage);
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const fetchGeminiResponse = async (message) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: message
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response format");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <header className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOC0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xOGMwLTIuMjA4LTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0xOCAxOGMwLTIuMjA4LTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0tMTggMGMwLTIuMjA4LTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0tMTggMGMwLTIuMjA4LTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0zNiAwYzAtMi4yMDgtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="max-w-6xl mx-auto flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight flex items-center">
              <span className="mr-2">Esmo</span>
              <span className="inline-block w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
            </h1>
            <p className="text-blue-100 mt-1 text-lg">Your intelligent AI companion</p>
          </div>
          <div className="bg-white/20 px-5 py-3 rounded-full text-sm backdrop-blur-sm border border-white/30 shadow-lg">
            Press spacebar to toggle voice input
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-hidden relative">
        <div className="max-w-6xl mx-auto h-full flex flex-col md:flex-row gap-6">
          <div className="md:w-2/5 h-80 md:h-auto relative rounded-2xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-600/90 p-1 rounded-2xl">
              <div className="absolute inset-0.5 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden">
                <div ref={splineContainerRef} className="absolute inset-0 rounded-xl">
                  {!robotLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-blue-500/30 rounded-full filter blur-xl"></div>
                  
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-gray-900 to-transparent flex items-center justify-center gap-4 p-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                  
                  <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-lg border border-gray-700 shadow-lg">
                    <div className="text-xs font-mono text-blue-300">ESMO-2025</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col h-full bg-white/80 rounded-2xl shadow-xl backdrop-blur-lg overflow-hidden border border-white/50">
            <div className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 p-4 text-white border-b border-blue-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="bg-white/20 p-1.5 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                  </span>
                  <h2 className="text-lg font-semibold">Chat with Esmo</h2>
                </div>
                {isListening && (
                  <div className="flex items-center bg-red-500/30 px-3 py-1 rounded-full text-xs">
                    <span className="mr-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Listening
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!message.isUser && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-2 mt-1 shadow-lg">
                        <span className="text-white text-xs font-bold">E</span>
                      </div>
                    )}
                    <div 
                      className={`p-4 rounded-2xl max-w-md shadow-lg ${
                        message.isUser 
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-br-none border border-blue-500' 
                          : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                      }`}
                      aria-label={message.isUser ? 'You said' : 'Esmo said'}
                    >
                      <p className="leading-relaxed">{message.text}</p>
                    </div>
                    {message.isUser && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-2 mt-1 shadow-lg">
                        <span className="text-gray-600 text-xs font-bold">You</span>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-2 mt-1 shadow-lg">
                      <span className="text-white text-xs font-bold">E</span>
                    </div>
                    <div className="bg-white p-5 rounded-2xl rounded-bl-none max-w-md shadow-lg border border-gray-200">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce"></div>
                        <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white/90 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className={`w-full p-4 pl-5 pr-12 border ${isListening ? 'border-red-400 bg-red-50' : 'border-gray-300'} rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-md`}
                    placeholder={isListening ? "Listening..." : "Type a message or press spacebar to speak"}
                    aria-label="Message input"
                  />
                  {isListening && (
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-8 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-6 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-10 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        <div className="w-2 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-lg ${
                    isListening 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-label={isListening ? "Stop listening" : "Start listening"}
                >
                  {isListening ? <StopIcon className="h-6 w-6" /> : <MicrophoneIcon className="h-6 w-6" />}
                </button>
                
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                  aria-label="Send message"
                >
                  <PaperAirplaneIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mt-2 text-center text-xs text-gray-500">
                Press <kbd className="px-2 py-1 bg-gray-100 rounded-md border border-gray-300 font-mono">Enter ↵</kbd> to send or <kbd className="px-2 py-1 bg-gray-100 rounded-md border border-gray-300 font-mono">Space</kbd> to toggle voice
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;