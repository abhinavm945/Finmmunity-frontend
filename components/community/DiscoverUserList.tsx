import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  fetchSuggestedUsers,
  followUser,
  unfollowUser,
  searchUsers,
  clearSearchResults,
} from "../../redux/communitySlice";
import Avatar from "../shared/Avatar";
import LoadingSpinner from "../shared/LoadingSpinner";
import EmptyState from "../shared/EmptyState";
import { UserPlus, UserMinus } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function DiscoverUserList() {
  const dispatch = useDispatch<AppDispatch>();
  const suggestedUsers = useSelector(
    (state: RootState) => state.community.suggestedUsers
  );
  const searchResults = useSelector(
    (state: RootState) => state.community.searchResults
  );
  const suggestedUsersLoading = useSelector(
    (state: RootState) => state.community.suggestedUsersLoading
  );
  const searchLoading = useSelector(
    (state: RootState) => state.community.searchLoading
  );
  const error = useSelector((state: RootState) => state.community.error);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [followLoading, setFollowLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!suggestedUsers || suggestedUsers.length === 0) {
      dispatch(fetchSuggestedUsers());
    }
  }, [dispatch, suggestedUsers]);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search.trim().length >= 2) {
        dispatch(searchUsers(search.trim()));
      } else if (search.trim().length === 0) {
        dispatch(clearSearchResults());
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, dispatch]);

  // Get users to display: search results filtered to only show non-followed users, or suggested users
  const getDisplayUsers = () => {
    console.log("Search query:", search);
    console.log("Search results:", searchResults);
    console.log("Suggested users:", suggestedUsers);
    console.log("Current user:", currentUser);
    if (
      search.trim().length >= 2 &&
      searchResults &&
      searchResults.length > 0
    ) {
      // When searching, show all search results (including users you follow)
      // but filter out the current user
      return searchResults.filter((user) => user.id !== currentUser?.id);
    }
    return suggestedUsers || [];
  };

  const displayUsers = getDisplayUsers();

  const handleFollowToggle = async (user: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Prevent card click
    setFollowLoading(user.id);
    try {
      console.log(
        `Before ${user.isFollowing ? "unfollow" : "follow"}: ${
          user.username
        } has ${user._count.followers} followers`
      );
      if (user.isFollowing) {
        await dispatch(unfollowUser(user.id));
      } else {
        await dispatch(followUser(user.id));
      }
      console.log(
        `After ${user.isFollowing ? "unfollow" : "follow"}: ${
          user.username
        } now has ${user._count.followers} followers`
      );
    } finally {
      setFollowLoading(null);
    }
  };

  if (suggestedUsersLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        type="error"
        onAction={() => dispatch(fetchSuggestedUsers())}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      {/* Search Bar */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="flex items-center w-full border border-gray-200 rounded-full px-4 py-2 mb-6 shadow-md bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 relative"
        style={{
          background: "linear-gradient(90deg, #2563eb 0%, #9333ea 100%)",
          boxShadow: "0 4px 24px 0 rgba(80, 63, 205, 0.08)",
        }}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="flex-grow outline-none placeholder-gray-200 text-white bg-transparent text-base font-medium"
          style={{
            textShadow: "0 1px 2px rgba(0,0,0,0.08)",
          }}
        />
        {searchLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white ml-2"></div>
        ) : (
          <UserPlus className="text-white ml-2" />
        )}
      </motion.div>

      {/* User List */}
      <div className="space-y-4">
        {displayUsers.length === 0 ? (
          <div className="py-12">
            {search.trim().length >= 2 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-2">
                  No users found matching "{search}"
                </p>
                <p className="text-sm text-gray-400">
                  Try searching for different users or clear your search
                </p>
              </div>
            ) : (
              <EmptyState
                type="suggestedUsers"
                onAction={() => dispatch(fetchSuggestedUsers())}
              />
            )}
          </div>
        ) : (
          displayUsers.map((user: any) => (
            <motion.div
              key={user.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between bg-white rounded-xl shadow p-4 transition-all border border-gray-100 hover:shadow-lg cursor-pointer"
              onClick={() => router.push(`/community/profile?id=${user.id}`)}
            >
              <div className="flex items-center gap-4">
                <Avatar
                  image={user.profilePicture}
                  size="md"
                  altText={user.username}
                />
                <div>
                  <div className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {user.username}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user._count?.followers ?? 0} followers
                  </div>
                  {user.bio && (
                    <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                      {user.bio}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => handleFollowToggle(user, e)}
                disabled={followLoading === user.id}
                className={`flex items-center px-4 py-2 text-sm rounded-full font-semibold shadow transition-all disabled:opacity-60 ${
                  user.isFollowing
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                }`}
              >
                {followLoading === user.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-1"></div>
                ) : user.isFollowing ? (
                  <UserMinus className="w-4 h-4 mr-1" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-1" />
                )}
                {followLoading === user.id
                  ? "Loading..."
                  : user.isFollowing
                  ? "Unfollow"
                  : "Follow"}
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
