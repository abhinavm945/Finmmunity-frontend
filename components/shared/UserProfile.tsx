"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Post, Blog } from "../../utils/types";
import { api } from "../../utils/api";
import Avatar from "./Avatar";
import LoadingSpinner from "./LoadingSpinner";
import CommentDialog from "../community/CommentDialog";
import BlogCommentDialog from "../community/BlogCommentDialog";
import PostCard from "../community/PostCard";
import BlogCard from "../community/BlogCard";
import RightSidebar from "../community/RightSidebar";
import { FaRegHeart } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { MessageCircle } from "lucide-react";

interface UserProfileData {
  id: string;
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  followers: UserProfileData[];
  following: UserProfileData[];
  posts: Post[];
  blogs: Blog[];
}

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("recent-content");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const [followers, setFollowers] = useState<UserProfileData[]>([]);
  const [following, setFollowing] = useState<UserProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const handleTabChange = (tab: string) => setActiveTab(tab);

  const handleOpenDialog = (post: Post) => setSelectedPost(post);
  const handleCloseDialog = () => setSelectedPost(null);
  const handleCloseBlogDialog = () => setSelectedBlog(null);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch user profile and related data in parallel
      const [profileRes, postsRes, blogsRes, followersRes, followingRes] =
        await Promise.all([
          api.user.getProfile(userId!),
          api.user.getPosts(userId!),
          api.user.getBlogs(userId!),
          api.user.getFollowers(userId!),
          api.user.getFollowing(userId!),
        ]);

      console.log("Fetched user profile:", profileRes);
      console.log("Fetched user posts:", postsRes);
      console.log("Fetched user blogs:", blogsRes);
      console.log("Fetched followers:", followersRes);
      console.log("Fetched following:", followingRes);

      if (profileRes.success && profileRes.data) {
        setUserProfile(profileRes.data.user || profileRes.data);
      }
      if (postsRes.success && postsRes.data) {
        setUserPosts(postsRes.data.posts || postsRes.data);
      }
      if (blogsRes.success && blogsRes.data) {
        setUserBlogs(blogsRes.data.blogs || blogsRes.data);
      }
      if (followersRes.success && followersRes.data) {
        setFollowers(followersRes.data.followers || followersRes.data);
      }
      if (followingRes.success && followingRes.data) {
        setFollowing(followingRes.data.following || followingRes.data);
      }
    } catch (err: Error) {
      setError(err.message || "Failed to fetch user data");
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowOrUnfollow = async () => {
    if (!userProfile) return;

    setLoadingFollow(true);
    try {
      const response = await api.community.users.toggleFollow(userProfile.id);
      console.log("Follow/unfollow response:", response);

      if (response.success) {
        setIsFollowing(!isFollowing);
        // Refresh followers count
        const followersRes = await api.user.getFollowers(userProfile.id);
        if (followersRes.success && followersRes.data) {
          setFollowers(followersRes.data.followers || followersRes.data);
        }
      }
    } catch (err: Error) {
      console.error("Error following/unfollowing:", err);
    } finally {
      setLoadingFollow(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUserData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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

  const isLoggedInUserProfile = false; // TODO: Compare with current user ID

  const displayedPosts = activeTab === "posts" ? userPosts : [];
  const displayedBlogs = activeTab === "blogs" ? userBlogs : [];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
          <section className="flex-shrink-0">
            <Avatar
              size="xl"
              image={userProfile.profilePicture || "/images/default-avatar.png"}
            />
          </section>
          <section className="w-full text-center md:text-left">
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 cursor-pointer">
                <span className="text-xl sm:text-2xl font-semibold">
                  {userProfile.username}
                </span>
                {isLoggedInUserProfile ? (
                  <div className="flex items-center gap-2">
                    <Link href="/account/edit">
                      <button className="hover:bg-gray-300 h-8 rounded-md bg-gray-200 px-4 cursor-pointer text-sm">
                        Edit profile
                      </button>
                    </Link>
                    <button className="hover:bg-gray-300 h-8 rounded-md bg-gray-200 px-4 cursor-pointer text-sm">
                      View Archive
                    </button>
                    <MdSettings
                      size={24}
                      className="hover:cursor-pointer text-gray-800"
                    />
                  </div>
                ) : isFollowing ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleFollowOrUnfollow}
                      disabled={loadingFollow}
                      className="bg-gray-200 hover:bg-gray-300 text-red-500 py-2 px-4 rounded-md text-sm cursor-pointer disabled:opacity-50"
                    >
                      {loadingFollow ? "Unfollowing..." : "Unfollow"}
                    </button>
                    <button className="hover:bg-gray-300 h-8 rounded-md bg-gray-200 px-4 cursor-pointer text-sm">
                      Message
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleFollowOrUnfollow}
                    disabled={loadingFollow}
                    className="bg-[#179cf5] hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-md text-sm cursor-pointer disabled:opacity-50"
                  >
                    {loadingFollow ? "Following..." : "Follow"}
                  </button>
                )}
              </div>
              <div className="flex justify-center md:justify-start gap-4 sm:gap-6 text-center md:text-left text-sm sm:text-base">
                <p>
                  <span className="font-semibold">{userBlogs.length}</span>{" "}
                  Blogs
                </p>
                <p>
                  <span className="font-semibold">{userPosts.length}</span>{" "}
                  Posts
                </p>
                <p className="cursor-pointer">
                  <span className="font-semibold">{followers.length}</span>{" "}
                  Followers
                </p>
                <p className="cursor-pointer">
                  <span className="font-semibold">{following.length}</span>{" "}
                  Following
                </p>
              </div>
              <div>
                <span className="text-sm sm:text-base">
                  {userProfile.bio || "No bio available"}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* TABS SECTION */}
        <div className="border-t border-t-gray-300 pt-4">
          <div className="flex items-center justify-center gap-4 sm:gap-8 lg:gap-12 text-xs sm:text-sm overflow-x-auto">
            {["recent-content", "posts", "blogs", "tags", "saved"].map(
              (tab) => (
                <span
                  key={tab}
                  className={`py-3 cursor-pointer whitespace-nowrap ${
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

          {/* Render tab content */}
          {activeTab === "recent-content" ? (
            <div className="flex flex-col mx-auto gap-4 max-w-lg">
              {userPosts.length || userBlogs.length ? (
                [...userPosts, ...userBlogs]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((item) =>
                    "title" in item ? (
                      <BlogCard key={item.id || item._id} blog={item} />
                    ) : (
                      <PostCard key={item.id || item._id} post={item} />
                    )
                  )
              ) : (
                <p className="text-center text-gray-500">
                  No recent content available.
                </p>
              )}
            </div>
          ) : activeTab === "blogs" ? (
            <div className="flex flex-col gap-4 max-w-xl mx-auto">
              {displayedBlogs.length > 0 ? (
                displayedBlogs.map((blog) => (
                  <BlogCard key={blog.id || blog._id} blog={blog} />
                ))
              ) : (
                <p className="text-center text-gray-500">No blogs available.</p>
              )}
            </div>
          ) : activeTab === "posts" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {displayedPosts.length > 0 ? (
                displayedPosts.map((post) => (
                  <div
                    onClick={() => handleOpenDialog(post)}
                    key={post.id || post._id}
                    className="relative group cursor-pointer"
                  >
                    <img
                      src={post.image || "/images/placeholder-post.jpg"}
                      alt="postimage"
                      className="rounded-md w-full aspect-square object-cover"
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
            <div className="text-center text-gray-500">
              <p>Tags feature coming soon...</p>
            </div>
          ) : activeTab === "saved" ? (
            <div className="text-center text-gray-500">
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
      <div className="hidden lg:block w-72 ml-auto">
        <RightSidebar />
      </div>
    </div>
  );
}
