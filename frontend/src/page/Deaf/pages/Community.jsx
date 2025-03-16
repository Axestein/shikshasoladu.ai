import React, { useState, useEffect } from "react";
import Forum from "../components/Forum";
import LiveChat from "../components/LiveChat";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Poll from "../components/Poll";
import SignLanguageVideo from "../components/SignLanguageVideo";
import VisualNotification from "../components/VisualNotification";
import { Video, Users, MessageCircle, Bell, ThumbsUp, Camera, Mic, Smile, FileText, ArrowRight } from "lucide-react";
import axios from "axios";
import SendBird from "sendbird"; // Import SendBird SDK

export default function Community() {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("forum"); // Tabs for navigation
  const [pollResults, setPollResults] = useState({});
  const [isSignLanguageOpen, setIsSignLanguageOpen] = useState(false);
  const [forumPosts, setForumPosts] = useState([]); // State for forum posts
  const [chatMessages, setChatMessages] = useState([]); // State for live chat messages
  const [polls, setPolls] = useState([]); // State for polls

  // SendBird API Key
  const SENDBIRD_APP_ID = "164d16b1ccba4327a67b7629";

  // Typeform Token Secret
  const TYPEFORM_TOKEN = "tfp_FPkHcTeUVTiuGZKMGoSEggwdwzVf6Vb2RtacHxkLLh23_3sv119gX6s7T71";

  // Fetch forum posts from API (keep the existing implementation)
  useEffect(() => {
    const fetchForumPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/forum/posts"); // Replace with your API endpoint
        setForumPosts(response.data);
      } catch (error) {
        console.error("Error fetching forum posts:", error);
      }
    };

    fetchForumPosts();
  }, []);

  // Fetch polls from Typeform API
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get("https://api.typeform.com/forms", {
          headers: {
            Authorization: `Bearer ${TYPEFORM_TOKEN}`,
          },
        });

        // Assuming the first form is the one you want to use
        const formId = response.data.items[0].id;
        const formResponse = await axios.get(`https://api.typeform.com/forms/${formId}`, {
          headers: {
            Authorization: `Bearer ${TYPEFORM_TOKEN}`,
          },
        });

        // Extract poll questions and options
        const pollData = formResponse.data.fields.map((field) => ({
          id: field.id,
          question: field.title,
          options: field.properties.choices.map((choice) => choice.label),
        }));

        setPolls(pollData);
      } catch (error) {
        console.error("Error fetching polls from Typeform:", error);
      }
    };

    fetchPolls();
  }, []);

  // Initialize SendBird for live chat
  useEffect(() => {
    const sb = new SendBird({ appId: SENDBIRD_APP_ID });

    // Connect to SendBird
    sb.connect("USER_ID", (user, error) => {
      if (error) {
        console.error("Error connecting to SendBird:", error);
        return;
      }

      // Join a channel (replace with your channel URL)
      const channelUrl = "YOUR_CHANNEL_URL";
      sb.GroupChannel.getChannel(channelUrl, (groupChannel, error) => {
        if (error) {
          console.error("Error fetching channel:", error);
          return;
        }

        // Listen for new messages
        groupChannel.onMessageReceived = (message) => {
          setChatMessages((prevMessages) => [...prevMessages, message]);
        };
      });
    });

    return () => {
      sb.disconnect();
    };
  }, []);

  // Handle poll submission to Typeform
  const handlePollSubmit = async (pollId, selectedOption) => {
    try {
      const formId = "https://form.typeform.com/to/vxw1LbQv"; // Replace with your Typeform form ID
      await axios.post(
        `https://api.typeform.com/forms/${formId}/responses`,
        {
          response: {
            answers: [
              {
                field: {
                  id: pollId,
                },
                choice: {
                  label: selectedOption,
                },
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${TYPEFORM_TOKEN}`,
          },
        }
      );

      // Update poll results locally
      setPollResults((prev) => ({
        ...prev,
        [pollId]: selectedOption,
      }));
    } catch (error) {
      console.error("Error submitting poll to Typeform:", error);
    }
  };

  // Fetch notifications from API (keep the existing implementation)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/notifications"); // Replace with your API endpoint
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Mark notification as read (keep the existing implementation)
  const markNotificationAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`); // Replace with your API endpoint
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      <Navbar />
      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 mt-20 bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Community Features</h1>
          <button
            onClick={() => setIsSignLanguageOpen(!isSignLanguageOpen)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            <Camera size={20} className="mr-2" />
            {isSignLanguageOpen ? "Close Sign Language" : "Open Sign Language"}
          </button>
        </div>
  
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("forum")}
            className={`px-6 py-2 rounded-lg ${
              activeTab === "forum"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-600 hover:text-white transition duration-300`}
          >
            <MessageCircle size={18} className="inline-block mr-2" />
            Forum
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-6 py-2 rounded-lg ${
              activeTab === "chat"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-600 hover:text-white transition duration-300`}
          >
            <Users size={18} className="inline-block mr-2" />
            Live Chat
          </button>
          <button
            onClick={() => setActiveTab("polls")}
            className={`px-6 py-2 rounded-lg ${
              activeTab === "polls"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-600 hover:text-white transition duration-300`}
          >
            <ThumbsUp size={18} className="inline-block mr-2" />
            Polls
          </button>
        </div>
  
        {/* Content Based on Active Tab */}
        {activeTab === "forum" && (
          <div className="space-y-8">
            <Forum posts={forumPosts} />
          </div>
        )}
  
        {activeTab === "chat" && (
          <div className="space-y-8">
            <LiveChat messages={chatMessages} />
          </div>
        )}
  
        {activeTab === "polls" && (
          <div className="space-y-8">
            {/* Use the new <Poll /> component with Typeform embed */}
            <Poll />
          </div>
        )}
  
        {/* Sign Language Video Modal */}
        {isSignLanguageOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">
                Sign Language Support
              </h2>
              <SignLanguageVideo />
              <button
                onClick={() => setIsSignLanguageOpen(false)}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
  
        {/* Visual Notifications */}
        <div className="fixed bottom-4 right-4 space-y-2">
          {notifications.map((notification) => (
            <VisualNotification
              key={notification.id}
              message={notification.message}
              type={notification.type}
              read={notification.read}
              onDismiss={() => markNotificationAsRead(notification.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}