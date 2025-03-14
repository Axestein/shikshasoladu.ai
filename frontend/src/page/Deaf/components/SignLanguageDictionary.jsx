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
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Language Dictionary Bot</h2>
        <p className="mt-2 text-center text-gray-600">
          Type a word and get its corresponding sign language GIF
        </p>

        <div className="mt-6 space-y-4 h-96 overflow-auto p-4 bg-white rounded-lg shadow-sm">
          {/* Chat messages */}
          <div className="space-y-4">
            {conversation.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs p-3 rounded-lg ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  {msg.type === 'user' ? (
                    <p className="text-white">{msg.text}</p>
                  ) : (
                    <>
                      {msg.text.includes('http') ? (
                        <img className="rounded-lg max-w-xs" src={msg.text} alt="sign language gif" />
                      ) : (
                        <p>{msg.text}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Type a word like 'hello' or 'thank you'"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignLanguageBot;
