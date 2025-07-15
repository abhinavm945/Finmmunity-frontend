/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import Avatar from "../shared/Avatar";
import Link from "next/link";
import { GoSmiley } from "react-icons/go";
import EmojiPicker from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import parse from "html-react-parser";
import { toast } from "react-toastify";
import { Bookmark, BookmarkCheck, MessageCircle, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import BlogDialog from "./BlogDialog";
import { config } from "../../utils/config";

// Add types for props
interface BlogCommentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  blog: any; // Replace 'any' with the actual blog type if available
}

const BlogCommentDialog = ({ open, setOpen, blog }: BlogCommentDialogProps) => {
  console.log("BlogCommentDialog received blog:", blog);
  const [text, setText] = useState("");
  // Add type for useSelector
  const user = useSelector((store: any) => store.user.user); // Replace 'any' with RootState if available
  const userProfile = useSelector((store: any) => store.user.profile); // Corrected from store.auth.userProfile
  const dispatch = useDispatch();
  const blogs = useSelector((store: any) => store.community.blogs);
  const [comments, setComments] = useState(blog?.comments || []);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // Fix dialogRef typing
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const emojiPickerRef = useRef(null);
  const author = blog?.author;

  // Like state
  const [liked, setLiked] = useState(blog?.likes?.includes(user?._id) || false);

  // Bookmark state
  const [isBookmark, setIsBookmark] = useState(
    userProfile?.bookmarks?.some((bookmark) => bookmark?._id === blog?._id) ||
      false
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  useEffect(() => {
    if (blog) {
      setComments(blog?.comments);
    }
  }, [blog]);

  if (!open) return null;

  const handleEmojiModal = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (emoji: { emoji: string }) => {
    setText((prevText) => prevText + emoji.emoji);
  };

  const LikeOrDisLikeHandler = async () => {
    if (!user) return toast.error("You need to be logged in to like blogs.");
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.post(
        `http://localhost:8000/api/v1/blog/${blog._id}/${action}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setLiked(!liked);
        // If you need to update blogs or profile, use dispatch with the appropriate thunk or action
        // For now, we'll just update the local state
        const updatedBlogs = blogs.map((b) =>
          b._id === blog._id
            ? {
                ...b,
                likes: liked
                  ? b.likes.filter((id) => id !== user._id)
                  : [...b.likes, user._id],
              }
            : b
        );
        // dispatch(setBlogs(updatedBlogs)); // This line was removed as per the edit hint
        if (userProfile && userProfile._id === blog.author?._id) {
          const updatedUserBlogs = {
            ...userProfile,
            blogs: userProfile.blogs.map((p) =>
              p._id === blog._id
                ? {
                    ...p,
                    likes: liked
                      ? p.likes.filter((id) => id !== user._id)
                      : [...p.likes, user._id],
                  }
                : p
            ),
          };
          // dispatch(setProfile(updatedUserBlogs)); // This line was removed as per the edit hint
        }
      }
    } catch (error) {
      toast.error("Failed to update like status. Try again.", error);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/blog/${blog?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setIsBookmark(res.data.type !== "unsaved");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async () => {
    if (!text.trim()) return toast.warning("Comment cannot be empty.");
    if (!user) return toast.error("You must be logged in to comment.");

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await axios.post(
        `${config.api.baseUrl}/community/comments`,
        { blogId: blog.id, content: text },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: true,
        }
      );

      if (res.data.success && res.data.comment) {
        setComments((prev) => [res.data.comment, ...prev]);
        setText("");
      } else {
        toast.error("Failed to Blog comment.");
      }
    } catch (error) {
      toast.error("An error occurred while posting the comment.");
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div
        ref={dialogRef}
        className="bg-white rounded-lg shadow-lg max-w-4xl w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl flex flex-col max-h-screen h-screen overflow-y-auto custom-scrollbar mx-2 sm:mx-4"
      >
        {/* Back button for mobile */}
        <button
          className="md:hidden absolute top-4 left-4 z-10 flex items-center gap-1 text-gray-700 bg-white bg-opacity-80 rounded-full px-3 py-1 shadow hover:bg-gray-100"
          onClick={() => setOpen(false)}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <div className="p-4 flex flex-col gap-4 custom-scrollbar pt-14 md:pt-0">
          {/* Author Info */}
          <div className="flex items-center gap-3">
            <Link href={`/profile/${blog.userId}`}>
              <Avatar size="md" image={blog.profilePicture || ""} />
            </Link>
            <div>
              <Link
                href={`/profile/${blog.userId}`}
                className="font-semibold text-lg hover:underline"
              >
                {blog.username || "Unknown"}
              </Link>
              <p className="text-sm text-gray-500">
                {new Date(blog?.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <BlogDialog blog={blog} />
            </div>
          </div>

          {/* Blog Title & Description */}
          <h2 className="text-xl font-bold">{blog.title}</h2>
          <div className="text-gray-700 text-sm">
            {parse(blog.content || "")}
          </div>

          {/* Blog Image / GIF */}
          {blog?.image && (
            <img
              className="max-w-lg max-h-96 object-contain rounded-lg"
              src={blog?.image}
              alt="Blog"
            />
          )}
          {blog?.gifUrl && (
            <img
              className="max-w-lg max-h-96 object-contain rounded-lg"
              src={blog?.gifUrl}
              alt="GIF"
            />
          )}

          {/* Like, Comment, Share, and Bookmark Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {liked ? (
                <FaHeart
                  size={"23px"}
                  className="cursor-pointer text-red-600 hover:text-gray-600"
                  onClick={LikeOrDisLikeHandler}
                />
              ) : (
                <FaRegHeart
                  size={"23px"}
                  className="cursor-pointer hover:text-gray-600"
                  onClick={LikeOrDisLikeHandler}
                />
              )}

              <MessageCircle className="cursor-pointer hover:text-gray-600" />
              <Send className="cursor-pointer hover:text-gray-600" />
            </div>
            {isBookmark ? (
              <BookmarkCheck
                onClick={bookmarkHandler}
                className="cursor-pointer hover:text-gray-600"
              />
            ) : (
              <Bookmark
                onClick={bookmarkHandler}
                className="cursor-pointer hover:text-gray-600"
              />
            )}
          </div>

          {/* Likes Count */}
          <span className="font-medium block">{blog?.likes?.length} likes</span>
        </div>

        <hr />

        {/* Comments Section - Scrollable */}
        <p className="font-bold mx-4 my-2 text-2xl">Comments</p>
        <div className="flex-1 p-4 space-y-2">
          {comments.length > 0 ? (
            comments.map((c) => (
              <div key={c.id || c._id} className="flex items-start gap-3">
                <Avatar size="xs" image={c.user?.profilePicture || ""} />
                <div>
                  <p className="font-semibold text-sm">
                    {c.user?.username || "Unknown"}
                  </p>
                  <p className="text-gray-700">{c.content || c.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No comments yet.</p>
          )}
        </div>

        {/* Comment Input Section - Fixed at Bottom */}
        <div className="p-3 border-t border-gray-300 bg-white sticky bottom-0">
          <div className="relative flex items-center gap-3">
            <GoSmiley
              className="text-gray-500 hover:text-gray-700 cursor-pointer text-2xl"
              onClick={handleEmojiModal}
            />
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-12 left-10 z-40 shadow-lg rounded-lg"
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
              </div>
            )}
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full outline-none border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              disabled={!text.trim()}
              onClick={commentHandler}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                text.trim()
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCommentDialog;
