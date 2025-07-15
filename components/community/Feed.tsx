"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PostList from "./PostList";
import BlogList from "./BlogList";
import PostCard from "./PostCard";
import BlogCard from "./BlogCard";
import { useSelector } from "react-redux";

interface FeedProps {
  userId?: string;
}

export default function Feed({ userId }: FeedProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlTab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(urlTab || "Blogs");
  const blogs = useSelector((state) => state.community.blogs);
  const posts = useSelector((state) => state.community.posts);

  // Get bookmarked items for Watchlist (this would need to be fetched from backend)
  const bookmarkedItems = [
    { id: 1, title: "Bitcoin Analysis", type: "blog" },
    { id: 2, title: "Market Update", type: "post" },
  ];

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
        {["Blogs", "Posts", "Watchlist"].map((tab) => (
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
          <PostList posts={posts} />
        ) : activeTab === "Blogs" ? (
          <BlogList blogs={blogs} />
        ) : (
          <div className="space-y-4 max-w-7xl mx-auto">
            <p className="text-center text-gray-500">
              Watchlist feature coming soon.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
