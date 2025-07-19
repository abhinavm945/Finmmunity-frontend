"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Post, Blog } from "../../utils/types";
import Avatar from "./Avatar";
import LoadingSpinner from "./LoadingSpinner";
import CommentDialog from "../community/CommentDialog";
import BlogCommentDialog from "../community/BlogCommentDialog";
import PostCard from "../community/PostCard";
import BlogCard from "../community/BlogCard";
import RightSidebar from "../community/RightSidebar";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import type { AppDispatch } from "../../redux/store";
import {
  fetchUserProfile,
  fetchFollowers,
  fetchFollowing,
  followOrUnfollowUser,
  unfollowUser,
  removeFollower,
  clearUserError,
} from "../../redux/userSlice";
import { fetchUserBlogs, fetchUserPosts } from "../../redux/communitySlice";
import { FaRegHeart } from "react-icons/fa";
import { MessageCircle } from "lucide-react";
import { MdSettings } from "react-icons/md";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function UserProfile() {
  const dispatch: AppDispatch = useDispatch();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const router = useRouter();

  // Redux selectors
  const user = useSelector((state: RootState) => state.user.user);
  const profile = useSelector(
    (state: RootState) => state.user.profile
  ) as unknown;
  const followers = useSelector(
    (state: RootState) => state.user.followers
  ) as unknown;
  const following = useSelector(
    (state: RootState) => state.user.following
  ) as unknown;

  // Safe array access with fallbacks
  const safeFollowers = Array.isArray(followers) ? followers : [];
  const safeFollowing = Array.isArray(following) ? following : [];
  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);

  // Community selectors for user's blogs and posts
  const userBlogsState = useSelector(
    (state: RootState) => state.community.userBlogs
  );
  const userPostsState = useSelector(
    (state: RootState) => state.community.userPosts
  );

  // Memoized data extraction
  const userBlogs = useMemo(() => {
    return userBlogsState?.data || [];
  }, [userBlogsState]);

  const userPosts = useMemo(() => {
    return userPostsState?.data || [];
  }, [userPostsState]);

  const isMyProfile = user && userId === user.id;
  const displayProfile = isMyProfile ? user : profile;

  // Local state for UI modals only
  const [activeTab, setActiveTab] = useState("recent-content");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const fetchedRef = useRef<string | null>(null);

  useEffect(() => {
    if (userId && fetchedRef.current !== userId) {
      dispatch(fetchUserProfile(userId));
      dispatch(fetchFollowers(userId));
      dispatch(fetchFollowing(userId));
      // Fetch user's blogs and posts
      dispatch(fetchUserBlogs(userId));
      dispatch(fetchUserPosts(userId));
      fetchedRef.current = userId;
    }
  }, [userId, dispatch]);

  useEffect(() => {
    // (Removed debug log)
  }, [profile]);

  const handleTabChange = (tab: string) => setActiveTab(tab);

  const handleOpenDialog = (post: Post) => setSelectedPost(post);
  const handleCloseDialog = () => setSelectedPost(null);
  const handleCloseBlogDialog = () => setSelectedBlog(null);

  const handleOpenFollowers = () => {
    setShowFollowersModal(true);
  };

  const handleOpenFollowing = () => {
    setShowFollowingModal(true);
  };

  const handleNavigateToProfile = (userId: string) => {
    setShowFollowersModal(false);
    setShowFollowingModal(false);
    router.push(`/community/profile?id=${userId}`);
  };

  // Follow/Unfollow logic
  const handleFollowOrUnfollow = async () => {
    if (
      !displayProfile ||
      typeof (displayProfile as any).id !== "string" ||
      !(displayProfile as any).id
    )
      return;
    setButtonLoading(true);
    await dispatch(followOrUnfollowUser((displayProfile as any).id));
    if (
      typeof (displayProfile as any).id === "string" &&
      (displayProfile as any).id
    ) {
      dispatch(fetchFollowers((displayProfile as any).id));
      dispatch(fetchFollowing((displayProfile as any).id));
    }
    setButtonLoading(false);
  };

  // Button logic
  const isLoggedInUserProfile =
    user && displayProfile && (user as any).id === (displayProfile as any).id;
  const isFollowing = displayProfile && (displayProfile as any).isFollowing;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen overflow-x-hidden">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen overflow-x-hidden top-0">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              dispatch(clearUserError());
              fetchedRef.current = null;
              if (userId) {
                dispatch(fetchUserProfile(userId));
                dispatch(fetchFollowers(userId));
                dispatch(fetchFollowing(userId));
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!displayProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen overflow-x-hidden">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            User Not Found
          </h2>
          <p className="text-gray-600">
            The user you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-2 sm:px-4 md:px-8 gap-8 overflow-x-hidden">
      {/* Left Section - Profile Info and Posts */}
      <div className="flex flex-col gap-10 p-2 w-full lg:w-3/4">
        {/* User Info Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
          {/* Profile Picture */}
          <section className="flex-shrink-0">
            <Avatar
              size="xl"
              image={
                (displayProfile as any)?.profilePicture ||
                "/images/default-avatar.png"
              }
            />
          </section>

          {/* Profile Details */}
          <section className="w-full text-center md:text-left">
            <div className="flex flex-col gap-2 md:gap-5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 cursor-pointer ">
                <span className="text-lg md:text-2xl font-extrabold italic bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {(displayProfile as any)?.username}
                </span>
                {/* Profile Action Buttons */}
                {isLoggedInUserProfile ? (
                  <div className="flex items-center gap-1 md:gap-2 ">
                    <button
                      onClick={() =>
                        router.push(
                          `/community/editprofile?id=${
                            (displayProfile as any)?.id
                          }`
                        )
                      }
                      className="hover:bg-gray-300 h-7 md:h-8 rounded-md bg-gray-200 px-2 md:px-4 cursor-pointer text-xs md:text-sm"
                    >
                      Edit profile
                    </button>
                    <button className="hover:bg-gray-300 h-7 md:h-8 rounded-md bg-gray-200 px-2 md:px-4 cursor-pointer text-xs md:text-sm">
                      View Archive
                    </button>
                    <MdSettings
                      size={18}
                      className="hover:cursor-pointer text-gray-800"
                    />
                  </div>
                ) : (
                  displayProfile &&
                  (displayProfile as any).id &&
                  !isLoggedInUserProfile && (
                    <div className="flex items-center gap-2 mt-2">
                      {isFollowing ? (
                        <>
                          <button
                            onClick={handleFollowOrUnfollow}
                            disabled={buttonLoading}
                            className="px-4 py-2 rounded bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow hover:from-red-600 hover:to-pink-600 transition"
                          >
                            {buttonLoading ? "..." : "Unfollow"}
                          </button>
                          <button className="px-4 py-2 rounded border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition">
                            Message
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleFollowOrUnfollow}
                          disabled={buttonLoading}
                          className="px-4 py-2 rounded bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:from-purple-600 hover:to-blue-600 transition"
                        >
                          {buttonLoading ? "..." : "Follow"}
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
              {/* Follower Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-6 text-center md:text-left text-xs md:text-base mt-2">
                <div className="flex flex-col items-center md:items-start">
                  <span className="font-bold text-lg md:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {userBlogs.length}
                  </span>
                  <span className="text-gray-500 text-xs md:text-sm">
                    Blogs
                  </span>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <span className="font-bold text-lg md:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {userPosts.length}
                  </span>
                  <span className="text-gray-500 text-xs md:text-sm">
                    Posts
                  </span>
                </div>
                <div
                  className="flex flex-col items-center md:items-start cursor-pointer"
                  onClick={handleOpenFollowers}
                >
                  <span className="font-bold text-lg md:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {safeFollowers.length}
                  </span>
                  <span className="text-gray-500 text-xs md:text-sm">
                    Followers
                  </span>
                </div>
                <div
                  className="flex flex-col items-center md:items-start cursor-pointer"
                  onClick={handleOpenFollowing}
                >
                  <span className="font-bold text-lg md:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {safeFollowing.length}
                  </span>
                  <span className="text-gray-500 text-xs md:text-sm">
                    Following
                  </span>
                </div>
              </div>
              {/* Bio and Buy Premium Button (left-aligned on desktop) */}
              <div className="mt-4 flex flex-col items-center md:items-start gap-3 w-full md:max-w-xs">
                <span className="text-xs md:text-base text-gray-700 w-full text-center md:text-left">
                  {(displayProfile as any)?.bio || "No bio available"}
                </span>
                {/* Show Buy Premium button only if not viewing own profile */}
                {!isLoggedInUserProfile && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-2 mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg hover:from-purple-700 hover:to-blue-700 transition"
                  >
                    Buy Premium
                  </motion.button>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Tabs Section */}
        <div className="border-t border-t-gray-300 pt-2 md:pt-4 mt-2 md:mt-4">
          <div className="flex items-center justify-center gap-4 md:gap-12 text-xs md:text-sm overflow-x-auto">
            {["recent-content", "posts", "blogs", "tags", "saved"].map(
              (tab) => (
                <span
                  key={tab}
                  className={`py-2 md:py-3 cursor-pointer whitespace-nowrap ${
                    activeTab === tab
                      ? "font-bold border-b-2 border-gray-400"
                      : "text-gray-500"
                  }`}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab.toUpperCase().replace("-", " ")}
                </span>
              )
            )}
          </div>

          {/* Display Posts for "Recent Content" as full posts */}
          {activeTab === "recent-content" ? (
            <div className="flex flex-col mx-auto gap-2 md:gap-4 max-w-xs md:max-w-lg mt-2 md:mt-4">
              {userBlogs.length > 0 || userPosts.length > 0 ? (
                [
                  ...userBlogs.map((blog: any) => ({ ...blog, type: "blog" })),
                  ...userPosts.map((post: any) => ({ ...post, type: "post" })),
                ]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((item) => {
                    if (item.type === "blog") {
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedBlog(item)}
                        >
                          <BlogCard blog={item as Blog} />
                        </div>
                      );
                    } else {
                      return <PostCard key={item.id} post={item as Post} />;
                    }
                  })
              ) : (
                <p className="text-center text-gray-500">
                  No recent content available.
                </p>
              )}
            </div>
          ) : activeTab === "blogs" ? (
            <div className="flex flex-col gap-2 md:gap-4 max-w-xs md:max-w-xl mx-auto mt-2 md:mt-4">
              {userBlogs && userBlogs.length > 0 ? (
                userBlogs.map((blog: any) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))
              ) : (
                <p className="text-center text-gray-500">No blogs available.</p>
              )}
            </div>
          ) : activeTab === "posts" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mt-2 md:mt-4">
              {userPosts && userPosts.length > 0 ? (
                userPosts.map((post: any) => (
                  <div
                    onClick={() => handleOpenDialog(post)}
                    key={post.id}
                    className="relative group cursor-pointer"
                  >
                    <img
                      src={post.image || "/images/placeholder-post.jpg"}
                      alt="postimage"
                      className="rounded-md w-full aspect-square object-cover max-h-32 md:max-h-48"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center text-white space-x-4">
                        <button className="flex items-center gap-2 hover:text-gray-300 cursor-pointer">
                          <span>{post.likes?.length || 0}</span>
                          <FaRegHeart size={22} />
                        </button>
                        <button className="flex items-center gap-2 hover:text-gray-300 cursor-pointer">
                          <span>{post.comments?.length || 0}</span>
                          <MessageCircle size={22} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">
                  No posts available.
                </p>
              )}
            </div>
          ) : activeTab === "tags" ? (
            <div className="text-center text-gray-500 mt-4">
              <p>Tags feature coming soon...</p>
            </div>
          ) : activeTab === "saved" ? (
            <div className="text-center text-gray-500 mt-4">
              <p>Saved items feature coming soon...</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Comment Dialogs */}
      {selectedPost && (
        <CommentDialog
          open={!!selectedPost}
          setOpen={handleCloseDialog}
          post={selectedPost}
        />
      )}
      {selectedBlog && (
        <BlogCommentDialog
          open={!!selectedBlog}
          setOpen={handleCloseBlogDialog}
          blog={selectedBlog}
        />
      )}
      {/* Right Sidebar - Fixed at Extreme Right */}
      <div className="hidden lg:block w-72 ml-auto">
        <RightSidebar />
      </div>
      {/* Followers Modal */}
      <AnimatePresence>
        {showFollowersModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-40 backdrop-blur-sm"
            onClick={() => setShowFollowersModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4 text-center">Followers</h2>
              {followersLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : safeFollowers.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No followers yet.
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto divide-y">
                  {safeFollowers.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="cursor-pointer"
                          onClick={() => handleNavigateToProfile(f.id)}
                        >
                          <Avatar
                            image={
                              f.profilePicture || "/images/default-avatar.png"
                            }
                            altText={f.username}
                            size="sm"
                          />
                        </div>
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleNavigateToProfile(f.id)}
                        >
                          <div className="font-semibold text-gray-900 hover:text-blue-600 transition">
                            {f.username}
                          </div>
                          {f.bio && (
                            <div className="text-sm text-gray-600 mt-1">
                              {f.bio}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Show Remove button only for logged-in user's own profile */}
                      {isLoggedInUserProfile && (
                        <button
                          onClick={() => {
                            dispatch(removeFollower(f.id));
                          }}
                          className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                onClick={() => setShowFollowersModal(false)}
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Following Modal */}
      <AnimatePresence>
        {showFollowingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-40 backdrop-blur-sm"
            onClick={() => setShowFollowingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4 text-center">Following</h2>
              {followingLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : safeFollowing.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Not following anyone yet.
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto divide-y">
                  {safeFollowing.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="cursor-pointer"
                          onClick={() => handleNavigateToProfile(f.id)}
                        >
                          <Avatar
                            image={
                              f.profilePicture || "/images/default-avatar.png"
                            }
                            altText={f.username}
                            size="sm"
                          />
                        </div>
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleNavigateToProfile(f.id)}
                        >
                          <div className="font-semibold text-gray-900 hover:text-blue-600 transition">
                            {f.username}
                          </div>
                          {f.bio && (
                            <div className="text-sm text-gray-600 mt-1">
                              {f.bio}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Show Unfollow button only for logged-in user's own profile */}
                      {isLoggedInUserProfile && (
                        <button
                          onClick={() => {
                            dispatch(unfollowUser(f.id));
                          }}
                          className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                        >
                          Unfollow
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                onClick={() => setShowFollowingModal(false)}
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
