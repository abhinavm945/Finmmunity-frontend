/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import Avatar from "../shared/Avatar";
import Link from "next/link";
import PostDialog from "./PostDialog";
import { GoSmiley } from "react-icons/go";
import EmojiPicker from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { Bookmark, BookmarkCheck, MessageCircle, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { config } from "../../utils/config";

const CommentDialog = ({ open, setOpen, post }) => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const posts = useSelector((store) => store.community.posts);
  const user = useSelector((store) => store.user.user);
  const userProfile = useSelector((store) => store.user.profile);
  const [comment, setComment] = useState(post?.comments || []);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const dialogRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const [liked, setLiked] = useState(
    post?.likes?.some((like) =>
      typeof like === "string" ? like === user?.id : like.userId === user?.id
    ) || false
  );
  const [isBookmark, setIsBookmark] = useState(
    userProfile?.bookmarks?.some((bookmark) => bookmark?._id === post?._id) ||
      false
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
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
    const handleOutsideClick = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        event.target.id !== "emoji-open"
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (post) {
      setComment(post?.comments);
      // Update like state when post changes
      setLiked(
        post?.likes?.some((like) =>
          typeof like === "string"
            ? like === user?.id
            : like.userId === user?.id
        ) || false
      );
    }
  }, [post, user?.id]);

  useEffect(() => {
    console.log("Comments in CommentDialog:", comment);
  }, [comment]);

  if (!open) return null;

  const handleEmojiModal = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (emoji) => {
    setText((prevText) => prevText + emoji.emoji);
  };

  const LikeOrDisLikeHandler = async () => {
    if (!user) return toast.error("You need to be logged in to like posts.");
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
        setLiked(!liked);
        // Update local state - Redux will be updated on next fetch
        toast.success(liked ? "Post unliked" : "Post liked");
      }
    } catch (error) {
      toast.error("Failed to update like status. Try again.");
      console.error("Error toggling like:", error);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await axios.post(
        `${config.api.baseUrl}/community/posts/${post?.id}/bookmark`,
        {},
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setIsBookmark(!isBookmark);
        toast.success(
          isBookmark ? "Post removed from bookmarks" : "Post added to bookmarks"
        );
      }
    } catch (error) {
      toast.error("Failed to update bookmark status. Try again.");
      console.error("Error toggling bookmark:", error);
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
        { postId: post.id, content: text },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: true,
        }
      );
      if (res.data.success && res.data.comment) {
        setComment((prev) => [res.data.comment, ...prev]);
        setText("");
      } else {
        toast.error("Failed to post comment.");
      }
    } catch (error) {
      toast.error("An error occurred while posting the comment.");
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div
        ref={dialogRef}
        className="bg-white p-0 rounded-lg shadow-lg max-w-5xl w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl flex flex-col mx-2 sm:mx-4"
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
        <div className="flex flex-1 flex-col md:flex-row w-full pt-14 md:pt-0">
          {/* Left Side Image */}
          <div className="w-full md:w-1/2">
            {post?.image && (
              <img
                className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                src={post?.image}
                alt="Post"
              />
            )}
          </div>
          {/* Right Side Comments Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <div className="flex justify-between items-center p-4">
              <div className="flex gap-3 items-center">
                <Link href={`/profile/${post?.userId}`}>
                  <Avatar size="xs" image={post?.profilePicture || ""} />
                </Link>
                <div>
                  <Link
                    href={`/profile/${post?.userId}`}
                    className="font-semibold text-sm hover:underline"
                  >
                    {post?.username || "Unknown"}
                  </Link>
                </div>
              </div>
              <PostDialog post={post} />
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4 space-y-2 custom-scrollbar">
              {comment.length > 0 ? (
                comment.map((c) => (
                  <div key={c?.id || c?._id} className="flex items-start gap-3">
                    {c?.user ? (
                      <>
                        <Avatar size="xs" image={c.user.profilePicture || ""} />
                        <div>
                          <p className="font-semibold text-sm">
                            {c.user.username || "Unknown"}
                          </p>
                          <p className="text-gray-700">{c.content || c.text}</p>
                        </div>
                      </>
                    ) : (
                      <div>
                        <p className="text-gray-500 italic">
                          Comment by anonymous user
                        </p>
                        <p className="text-gray-700">{c?.content || c?.text}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No comments yet.</p>
              )}
            </div>
            <div className="flex justify-between items-center p-4 border-t border-gray-300">
              <div className="flex items-center gap-3">
                {liked ? (
                  <FaHeart
                    size={23}
                    className="cursor-pointer text-red-600 hover:text-gray-600"
                    onClick={LikeOrDisLikeHandler}
                  />
                ) : (
                  <FaRegHeart
                    size={23}
                    className="cursor-pointer hover:text-gray-600"
                    onClick={LikeOrDisLikeHandler}
                  />
                )}
                <MessageCircle className="cursor-pointer hover:text-gray-600" />
                <Send
                  className="cursor-pointer hover:text-gray-600"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/community/post/${post.id}`
                    );
                    toast.success("Post link copied to clipboard!");
                  }}
                />
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
            <span className="font-medium block px-4 pb-2">
              {post?.likes.length} likes
            </span>
            <div className="p-3 border-t border-gray-300">
              <div className="relative flex items-center gap-3">
                <GoSmiley
                  className="text-gray-500 hover:text-gray-700 cursor-pointer text-2xl"
                  title="Emoji"
                  id="emoji-open"
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
      </div>
    </div>
  );
};

export default CommentDialog;
