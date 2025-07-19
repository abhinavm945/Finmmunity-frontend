/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Bookmark, BookmarkCheck, MessageCircle, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Avatar from "../shared/Avatar";
import { motion } from "framer-motion";
import CommentDialog from "./CommentDialog";
import Image from "next/image";
import { Post, User } from "../../utils/types";
import axios from "axios";
import { config } from "../../utils/config";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const user = useSelector(
    (state: { user: { user: User } }) => state.user?.user
  );

  // Use author info from post.user
  const author: { profilePicture?: string; username: string } = post.user;

  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [showComments, setShowComments] = useState(false);
  const [text, setText] = useState("");
  // Change the likes state type to (string | { userId: string })[]
  const [likes, setLikes] = useState<(string | { userId: string })[]>(
    post.likes
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
    setText("");
  };

  const handleLike = async () => {
    if (!user) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await axios.post(
        `${config.api.baseUrl}/community/posts/${post.id}/like`,
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
        `${config.api.baseUrl}/community/posts/${post.id}/bookmark`,
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
            ? "Post removed from bookmarks"
            : "Post added to bookmarks"
        );
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href + `/post/${post.id}`);
  };

  const handleShowComments = () => {
    console.log("Post passed to CommentDialog:", post);
    setShowComments(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto p-4 sm:p-6 mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300 group"
    >
      {/* Post Author and Date */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar
            size="xs"
            image={author.profilePicture || "/images/default-avatar.png"}
          />
          <span className="font-medium text-gray-700">{author.username}</span>
        </div>
        <span className="text-xs text-gray-400">
          {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
        </span>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="w-full rounded-xl overflow-hidden mb-4">
          <Image
            src={post.image || "/images/placeholder-post.jpg"}
            alt={post.content || "Post image"}
            width={900}
            height={500}
            className="w-full h-auto object-contain max-h-[400px] bg-gray-50"
            style={{ maxHeight: "400px" }}
            priority
          />
        </div>
      )}

      {/* Post Caption (Content) */}
      <p className="text-base sm:text-lg text-gray-800 mb-2 break-words leading-relaxed">
        <span className="font-semibold mr-2">{author.username}</span>
        {post.content}
      </p>

      {/* Post Actions */}
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
            onClick={handleShowComments}
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
        {post.comments?.length > 0 && (
          <span
            className="cursor-pointer hover:underline"
            onClick={() => setShowComments(true)}
          >
            View all {post.comments.length} comments
          </span>
        )}
      </div>

      {/* Comments Dialog */}
      <CommentDialog
        open={showComments}
        setOpen={setShowComments}
        post={post}
      />

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
};

export default PostCard;
