"use client";

import { useEffect, useState } from "react";
import { useNews, useCommunity } from "../../hooks/useApi";
import { useSocket } from "../../utils/socket";
import LoadingSpinner from "../shared/LoadingSpinner";

export default function ApiExample() {
  const { news } = useNews();
  const { posts } = useCommunity();
  const socket = useSocket();
  const [notifications, setNotifications] = useState<
    Array<{ content: string }>
  >([]);

  // Load news on component mount
  useEffect(() => {
    news.getAll.execute({ page: 1, limit: 5 });
  }, [news.getAll]);

  // Listen for real-time notifications
  useEffect(() => {
    socket.onNotification((notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, [socket]);

  // Example: Create a post
  const handleCreatePost = async () => {
    const formData = new FormData();
    formData.append("content", "This is a test post from the API integration!");

    const result = await posts.create.execute(formData);
    if (result) {
      console.log("Post created successfully:", result);
      // Refresh posts list
      posts.getAll.execute({ page: 1, limit: 10 });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        API Integration Example
      </h1>

      {/* News Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Latest News</h2>

        {news.getAll.loading && <LoadingSpinner />}

        {news.getAll.error && (
          <div className="text-red-500 bg-red-50 p-3 rounded">
            Error: {news.getAll.error}
          </div>
        )}

        {news.getAll.data && (
          <div className="space-y-4">
            {news.getAll.data.map(
              (
                newsItem: { title: string; description: string },
                index: number
              ) => (
                <div key={index} className="border-b pb-4">
                  <h3 className="font-medium">{newsItem.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {newsItem.description}
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Create Post Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Create Post</h2>

        <button
          onClick={handleCreatePost}
          disabled={posts.create.loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {posts.create.loading ? "Creating..." : "Create Test Post"}
        </button>

        {posts.create.error && (
          <div className="text-red-500 bg-red-50 p-3 rounded mt-3">
            Error: {posts.create.error}
          </div>
        )}
      </div>

      {/* Socket Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Real-time Status</h2>

        <div className="space-y-2">
          <p>
            Socket Connected:{" "}
            <span
              className={
                socket.getConnectionStatus() ? "text-green-500" : "text-red-500"
              }
            >
              {socket.getConnectionStatus() ? "Yes" : "No"}
            </span>
          </p>

          <p>Notifications Received: {notifications.length}</p>

          {notifications.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Recent Notifications:</h3>
              {notifications.slice(0, 3).map((notification, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                  {notification.content}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* API Usage Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">How to Use the API</h2>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium">1. Using Custom Hooks:</h3>
            <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
              {`const { news } = useNews();
const { posts } = useCommunity();

// Execute API call
news.getAll.execute({ page: 1, limit: 10 });

// Access state
{news.getAll.loading && <LoadingSpinner />}
{news.getAll.error && <ErrorMessage error={news.getAll.error} />}
{news.getAll.data && <DataComponent data={news.getAll.data} />}`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium">2. Using API Client Directly:</h3>
            <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
              {`import { api } from '../utils/api';

const response = await api.news.getAllNews({ page: 1, limit: 10 });
if (response.success) {
  console.log(response.data);
}`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium">3. File Upload:</h3>
            <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
              {`const formData = new FormData();
formData.append('content', 'Post content');
formData.append('image', file);

const response = await api.community.posts.create(formData);`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium">4. Socket.io Events:</h3>
            <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
              {`const socket = useSocket();

socket.onNotification((notification) => {
  console.log('New notification:', notification);
});

socket.sendMessage({ content: 'Hello', receiverId: 'user_id' });`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
