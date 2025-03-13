import React, { useState, useEffect } from "react";

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    // Simulate fetching forum posts
    const data = JSON.parse(localStorage.getItem("forumPosts")) || [];
    setPosts(data);
  }, []);

  const handlePost = () => {
    if (newPost.trim() === "") return;

    const updatedPosts = [
      ...posts,
      { id: Date.now(), content: newPost, replies: [] },
    ];
    setPosts(updatedPosts);
    localStorage.setItem("forumPosts", JSON.stringify(updatedPosts));
    setNewPost("");
  };

  const handleReply = (postId, reply) => {
    if (reply.trim() === "") return;

    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? { ...post, replies: [...post.replies, reply] }
        : post
    );
    setPosts(updatedPosts);
    localStorage.setItem("forumPosts", JSON.stringify(updatedPosts));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Forums and Discussion Boards
      </h2>
      <div className="space-y-4">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Start a new discussion..."
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handlePost}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Post
        </button>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700">{post.content}</p>
              <div className="mt-2 space-y-2">
                {post.replies.map((reply, index) => (
                  <div key={index} className="pl-4 border-l-2 border-gray-200">
                    <p className="text-gray-600">{reply}</p>
                  </div>
                ))}
                <textarea
                  placeholder="Reply to this post..."
                  onBlur={(e) => handleReply(post.id, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}