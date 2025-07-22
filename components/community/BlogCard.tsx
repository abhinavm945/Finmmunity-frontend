"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { updateBlogLocally } from "../../redux/communitySlice";
import { toast } from "react-toastify";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const dispatch = useDispatch();
  // Always get the latest blog from Redux by id
  const blogFromRedux = useSelector((state: any) =>
    state.community.blogs.find((b: any) => b.id === blog.id)
  );
  const currentBlog = blogFromRedux || blog;

  // Debug log for comments

  const user = useSelector(
    (state: { user: { user: User } }) => state.user?.user
  );

  const [isBookmarked, setIsBookmarked] = useState(
    currentBlog.isBookmarked || false
  );
  const [showComments, setShowComments] = useState(false);
  const [text, setText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const liked =
    !!user &&
    currentBlog.likes.some((like: any) =>
      typeof like === "string" ? like === user.id : like.userId === user.id
    );

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const commentHandler = async () => {
    if (!text.trim()) return toast.warning("Comment cannot be empty.");
    if (!user) return toast.error("You must be logged in to comment.");
    if (isCommenting) return;
    setIsCommenting(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await axios.post(
        `${config.api.baseUrl}/community/comments`,
        { blogId: currentBlog.id, content: text },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: true,
        }
      );
      if (res.data.success && res.data.comment && res.data.blog) {
        dispatch(updateBlogLocally(res.data.blog));
        setText("");
      } else {
        toast.error("Failed to post comment.");
      }
    } catch (error) {
      toast.error("An error occurred while posting the comment.");
      console.log(error);
    } finally {
      setIsCommenting(false);
    }
  };

  // Use author info from blog.user
  const author: { profilePicture?: string; username: string } =
    currentBlog.user;

  const handleLike = async () => {
    if (!user) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await axios.post(
        `${config.api.baseUrl}/community/blogs/${currentBlog.id}/like`,
        {},
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: true,
        }
      );
      if (res.data.success && res.data.blog) {
        dispatch(updateBlogLocally(res.data.blog));
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
        `${config.api.baseUrl}/community/blogs/${currentBlog.id}/bookmark`,
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
        console.log(
          isBookmarked
            ? "Blog removed from bookmarks"
            : "Blog added to bookmarks"
        );
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      window.location.href + `/blog/${currentBlog.id}`
    );
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
        {currentBlog.title}
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
          {formatDate(currentBlog.createdAt)}
        </span>
      </div>

      {/* Blog Content/Description */}
      <p className="text-base sm:text-lg text-gray-800 mb-4 break-words leading-relaxed">
        {currentBlog.content}
      </p>

      {/* Blog Image or GIF */}
      {(currentBlog.gifUrl || currentBlog.image) && (
        <div className="w-full rounded-xl overflow-hidden mb-4">
          <Image
            src={
              currentBlog.gifUrl ||
              currentBlog.image ||
              "/images/placeholder-post.jpg"
            }
            alt={currentBlog.title}
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
        <span className="font-medium">{currentBlog.likes.length} likes</span>
        {currentBlog.comments.length > 0 && (
          <span
            className="cursor-pointer hover:underline"
            onClick={() => setShowComments(true)}
          >
            View all {currentBlog.comments.length} comments
          </span>
        )}
      </div>

      {/* Comment Dialog */}
      {showComments && (
        <BlogCommentDialog
          open={showComments}
          setOpen={setShowComments}
          blog={currentBlog}
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
            onClick={!text.trim() || isCommenting ? undefined : commentHandler}
            className={`text-[#3badf8] cursor-pointer ml-2 font-semibold ${
              !text.trim() || isCommenting
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
          >
            Post
          </span>
        )}
      </div>
    </motion.div>
  );
}
