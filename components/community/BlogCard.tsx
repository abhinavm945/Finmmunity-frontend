"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Bookmark, BookmarkCheck, MessageCircle, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Avatar from "../shared/Avatar";
import { motion } from "framer-motion";
import BlogCommentDialog from "./BlogCommentDialog";
import { Blog } from "../../utils/types";

import { formatDate } from "../../utils/formatDate";
import Image from "next/image";
import { User } from "../../utils/types";
import axios from "axios";
import { config } from "../../utils/config";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  console.log("BlogCard received blog:", blog);

  const user = useSelector(
    (state: { user: { user: User } }) => state.user?.user
  );

  const [isBookmarked, setIsBookmarked] = useState(blog.isBookmarked || false);
  const [showComments, setShowComments] = useState(false);
  const [text, setText] = useState("");
  // Change the likes state type to (string | { userId: string })[]
  const [likes, setLikes] = useState<(string | { userId: string })[]>(
    blog.likes
  );
  const liked =
    !!user &&
    likes.some((like) =>
      typeof like === "string" ? like === user.id : like.userId === user.id
    );

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const commentHandler = () => {
    // Implement comment submission logic here
    setText("");
  };

  // Use author info from blog.user
  const author: { profilePicture?: string; username: string } = blog.user;

  const handleLike = async () => {
    if (!user) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await axios.post(
        `${config.api.baseUrl}/community/blogs/${blog.id}/like`,
        {},
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        if (res.data.likes) {
          setLikes(res.data.likes);
        }
        // Update local state - Redux will be updated on next fetch
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleBookmark = async () => {
    if (!user) return;

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await axios.post(
        `${config.api.baseUrl}/community/blogs/${blog.id}/bookmark`,
        {},
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setIsBookmarked(!isBookmarked);
        // You can add toast notification here if you have toast set up
        console.log(isBookmarked ? "Blog removed from bookmarks" : "Blog added to bookmarks");
      }
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
      className="w-full max-w-2xl mx-auto p-4 sm:p-6 mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300 group"
    >
      {/* Blog Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
        {blog.title}
      </h2>

      {/* Blog Author and Date */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar
            size="xs"
            image={author.profilePicture || "/images/default-avatar.png"}
          />
          <span className="font-medium text-gray-700">{author.username}</span>
        </div>
        <span className="text-xs text-gray-400">
          {formatDate(blog.createdAt)}
        </span>
      </div>

      {/* Blog Content/Description */}
      <p className="text-base sm:text-lg text-gray-800 mb-4 break-words leading-relaxed">
        {blog.content}
      </p>

      {/* Blog Image or GIF */}
      {(blog.gifUrl || blog.image) && (
        <div className="w-full rounded-xl overflow-hidden mb-4">
          <Image
            src={blog.gifUrl || blog.image || "/images/placeholder-post.jpg"}
            alt={blog.title}
            width={900}
            height={500}
            className="w-full h-auto object-contain max-h-[400px] bg-gray-50"
            style={{ maxHeight: "400px" }}
            priority
          />
        </div>
      )}

      {/* Blog Actions */}
      <div className="flex flex-wrap justify-between items-center mb-2 mt-3 gap-2">
        <div className="flex items-center gap-4">
          {liked ? (
            <FaHeart
              size="23px"
              className="cursor-pointer text-red-600 hover:text-gray-600 transition-colors duration-200"
              onClick={handleLike}
            />
          ) : (
            <FaRegHeart
              size="23px"
              className="cursor-pointer hover:text-gray-600 transition-colors duration-200"
              onClick={handleLike}
            />
          )}
          <MessageCircle
            className="cursor-pointer hover:text-blue-500 transition-colors duration-200"
            onClick={() => setShowComments(true)}
          />
          <Send
            className="cursor-pointer hover:text-blue-500 transition-colors duration-200"
            onClick={handleShare}
          />
        </div>
        {isBookmarked ? (
          <BookmarkCheck
            className="cursor-pointer text-blue-600 hover:text-gray-600 transition-colors duration-200"
            onClick={handleBookmark}
          />
        ) : (
          <Bookmark
            className="cursor-pointer hover:text-gray-600 transition-colors duration-200"
            onClick={handleBookmark}
          />
        )}
      </div>

      {/* Likes and Comments Count */}
      <div className="my-2 flex flex-wrap gap-4 text-sm text-gray-600">
        <span className="font-medium">{likes.length} likes</span>
        {blog.comments.length > 0 && (
          <span
            className="cursor-pointer hover:underline"
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

      {/* Add Comment */}
      <div className="flex items-center justify-between mt-2 border-t pt-3">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full bg-transparent px-2 py-1"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3badf8] cursor-pointer ml-2 font-semibold"
          >
            Post
          </span>
        )}
      </div>
    </motion.div>
  );
}
