"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PostList from "./PostList";
import BlogList from "./BlogList";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import type { User, Post, Blog } from "../../utils/types";

interface FeedProps {
  userId?: string;
}

export default function Feed({ userId }: FeedProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlTab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(urlTab || "Blogs");
  const blogs = useSelector(
    (state: RootState) => state.community.blogs
  ) as Blog[];
  const posts = useSelector(
    (state: RootState) => state.community.posts
  ) as Post[];
  const following = useSelector(
    (state: RootState) => state.user.following
  ) as User[];
  const currentUser = useSelector(
    (state: RootState) => state.user.user
  ) as User | null;

  // Strictly filter: only show posts/blogs from users I follow, and not my own
  const followingIds = following?.map((u) => u.id) || [];
  const myId = currentUser?.id;

  const filteredPosts = posts.filter(
    (post) =>
      post.user && followingIds.includes(post.user.id) && post.user.id !== myId
  );
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.user && followingIds.includes(blog.user.id) && blog.user.id !== myId
  );

  // Update URL parameters when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams();
    if (userId) params.set("id", userId);
    if (tab !== "Blogs") params.set("tab", tab);

    const newURL = params.toString()
      ? `/community?${params.toString()}`
      : "/community";
    router.push(newURL);
  };

  return (
    <>
      <div className="flex items-center justify-center gap-8 text-sm border-b">
        {["Blogs", "Posts", "Premium"].map((tab) => (
          <button
            key={tab}
            className={`py-4 px-2 font-medium ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="my-4">
        {activeTab === "Posts" ? (
          <PostList posts={filteredPosts} />
        ) : activeTab === "Blogs" ? (
          <BlogList blogs={filteredBlogs} />
        ) : (
          <div className="space-y-4 max-w-7xl mx-auto">
            <p className="text-center text-gray-500">
              Premium feature coming soon.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
