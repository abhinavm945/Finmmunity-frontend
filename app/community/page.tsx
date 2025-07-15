"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchBlogs } from "../../redux/communitySlice";
import Feed from "../../components/community/Feed";
import ProtectedRoute from "../../components/shared/ProtectedRoute";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";

export default function CommunityPage() {
  const dispatch = useDispatch();
  const { posts, blogs, loading, error } = useSelector(
    (state) => state.community
  );
  const { userId } = useAuth();

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchBlogs());
  }, [dispatch]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Error Loading Community
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div>
        <Feed userId={userId} posts={posts} blogs={blogs} />
      </div>
    </ProtectedRoute>
  );
}
