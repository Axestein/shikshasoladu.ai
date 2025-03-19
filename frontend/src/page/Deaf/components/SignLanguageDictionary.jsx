import React, { useState } from 'react';
import axios from 'axios';

const GIPHY_API_KEY = 'eRcNLK0AZHrhOprGsL7Gq4hkGiqcKVtm'; // Replace with your Giphy API key

const SignLanguageBot = () => {
  const [message, setMessage] = useState('');
  const [gifUrl, setGifUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const fetchGif = async () => {
    if (message.trim()) { 
      setLoading(true);

      // Add user message to conversation
      setConversation([...conversation, { type: 'user', text: message }]);

      try {
        const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
          params: {
            q: message, // The word entered by the user
            api_key: GIPHY_API_KEY,
            limit: 1, // Only get 1 GIF for now
          },
        });

        // Check if there are results
        if (response.data.data.length > 0) {
          setGifUrl(response.data.data[0].images.original.url);
        } else {
          setGifUrl('');
        }

        // Add bot message to conversation
        setConversation([
          ...conversation, 
          { type: 'user', text: message },
          { type: 'bot', text: gifUrl ? response.data.data[0].images.original.url : 'No GIF found' },
        ]);
      } catch (error) {
        console.error('Error fetching GIF:', error);
        setGifUrl('');
      }
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchGif();
    setMessage(''); // Reset the input field after sending
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Sign Language Dictionary Bot</h2>
        <p className="mt-2 text-center text-gray-600">
          Type a word and get its corresponding sign language GIF
        </p>

        <div className="mt-6 h-96 overflow-hidden rounded-xl shadow-lg relative">
          {/* Glass background effect */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-0 rounded-xl"></div>
          
          {/* Conversation container */}
          <div className="h-full overflow-auto p-4 relative z-10">
            <div className="space-y-4 pb-2">
              {conversation.map((msg, index) => (
                <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                  <div
                    className={`max-w-xs p-3 rounded-xl transition-all duration-300 hover:shadow-md ${
                      msg.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                        : 'bg-white/80 shadow-sm border border-gray-100'
                    }`}
                  >
                    {msg.type === 'user' ? (
                      <p className="text-white">{msg.text}</p>
                    ) : (
                      <>
                        {msg.text.includes('http') ? (
                          <div className="rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
                            <img className="rounded-lg max-w-xs" src={msg.text} alt="sign language gif" />
                          </div>
                        ) : (
                          <p className="text-gray-700">{msg.text}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 relative">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={handleInputChange}
              placeholder="Type a word like 'hello' or 'thank you'"
              className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 pl-5"
            />
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-4 rounded-xl shadow-md transform transition-all duration-300 ${
                loading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <span className="animate-pulse">Loading...</span>
                </div>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
};

export default SignLanguageBot;    