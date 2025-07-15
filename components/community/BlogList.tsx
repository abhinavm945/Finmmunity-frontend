"use client";

import BlogCard from "./BlogCard";
import { Blog } from "../../utils/types";

interface BlogListProps {
  blogs: Blog[];
}

export default function BlogList({ blogs }: BlogListProps) {
  return (
    <div className="space-y-4 w-full px-2 sm:px-0">
      {blogs.length > 0 ? (
        blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
      ) : (
        <p className="text-center text-gray-500">No blogs available.</p>
      )}
    </div>
  );
}
