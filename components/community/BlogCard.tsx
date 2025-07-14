"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { Bookmark, BookmarkCheck, MessageCircle, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Avatar from "../shared/Avatar";
import { motion } from "framer-motion";
import BlogCommentDialog from "./BlogCommentDialog";
import { Blog } from "../../utils/types";
import { useCommunity } from "../../hooks/useApi";
import { formatDate } from "../../utils/formatDate";
import { truncateText } from "../../utils/truncateText";
import Image from "next/image";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const user = useSelector((state) => state.user?.user);
  const { blogs, bookmarks } = useCommunity();

  const [liked, setLiked] = useState(blog.likes.includes(user?.id || ""));
  const [isBookmarked, setIsBookmarked] = useState(blog.isBookmarked || false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (!user) return;

    try {
      if (liked) {
        await blogs.unlike.execute({ id: blog.id });
      } else {
        await blogs.like.execute({ id: blog.id });
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleBookmark = async () => {
    if (!user) return;

    try {
      if (isBookmarked) {
        await bookmarks.remove.execute({ id: blog.id });
      } else {
        await bookmarks.add.execute({ type: "BLOG", blogId: blog.id });
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href + `/blog/${blog.id}`);
    alert("Link copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-lg mx-auto p-6 mb-6 bg-white rounded-lg shadow-sm border border-gray-200"
    >
      {/* Blog Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Avatar
            size="xs"
            image={blog.user.profilePicture || "/images/default-avatar.png"}
          />
          <h1 className="font-medium text-gray-900">{blog.user.username}</h1>
        </div>
        <span className="text-sm text-gray-500">
          {formatDate(blog.createdAt)}
        </span>
      </div>

      {/* Blog Image */}
      {blog.image && (
        <Image
          src={blog.image || "/images/placeholder-post.jpg"}
          alt={blog.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}

      {/* Blog Title and Content */}
      <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
      <p>{truncateText(blog.content, 100)}</p>

      {/* Blog Actions */}
      <div className="flex justify-between items-center mb-2 mt-3">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              size="23px"
              className="cursor-pointer text-red-600 hover:text-gray-600"
              onClick={handleLike}
            />
          ) : (
            <FaRegHeart
              size="23px"
              className="cursor-pointer hover:text-gray-600"
              onClick={handleLike}
            />
          )}
          <MessageCircle
            className="cursor-pointer hover:text-gray-600"
            onClick={() => setShowComments(true)}
          />
          <Send
            className="cursor-pointer hover:text-gray-600"
            onClick={handleShare}
          />
        </div>
        {isBookmarked ? (
          <BookmarkCheck
            className="cursor-pointer hover:text-gray-600"
            onClick={handleBookmark}
          />
        ) : (
          <Bookmark
            className="cursor-pointer hover:text-gray-600"
            onClick={handleBookmark}
          />
        )}
      </div>

      {/* Likes and Comments Count */}
      <div className="my-2">
        <span className="font-medium block">{blog.likes.length} likes</span>
        {blog.comments.length > 0 && (
          <span
            className="cursor-pointer text-sm text-gray-600 block"
            onClick={() => setShowComments(true)}
          >
            View all {blog.comments.length} comments
          </span>
        )}
      </div>

      {/* Comment Dialog */}
      {showComments && (
        <BlogCommentDialog
          open={showComments}
          setOpen={setShowComments}
          blog={blog}
        />
      )}
    </motion.div>
  );
}
