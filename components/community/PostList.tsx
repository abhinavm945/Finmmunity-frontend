"use client";

import PostCard from "./PostCard";
import { Post } from "../../utils/demoData";

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <p className="text-center text-gray-500">No posts available.</p>
      )}
    </div>
  );
}
