# Full Frontend Functionality Reference

This document contains the full content of every source file in the frontend project, organized by file path. Use this as a complete reference for integration, review, or copy-paste purposes.

---

## src/components/Avatar.jsx

```jsx
/* eslint-disable react/prop-types */
import defaultAvatar from "../assets/default-avatar.png";

function Avatar({ size, image, altText = "User avatar" }) {
  const sizes = {
    xs: "h-8 w-8",
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-20 w-20",
    xl: "h-40 w-40",
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`relative ${sizes[size]}`}>
        <img
          src={image || defaultAvatar}
          alt={altText}
          className="rounded-full object-cover w-full h-full"
        />
      </div>
    </div>
  );
}

export default Avatar;
```

---

## src/components/Blog.jsx

```jsx
/* eslint-disable react/prop-types */
import { Bookmark, BookmarkCheck, MessageCircle, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Avatar from "./Avatar";
import BlogDialog from "./BlogDialog";
import BlogCommentDialog from "./BlogCommentDialog";
import { setBlogs } from "../redux/postSlice.js";
import { toast } from "react-toastify";
import { setUserProfile } from "../redux/authSlice.js";
import { Link } from "react-router-dom";

const Blog = ({ blog }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const { user, userProfile } = useSelector((store) => store.auth);
  const { blogs } = useSelector((store) => store.post);

  const author = blog?.author;

  // States
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(blog?.likes.includes(user?._id) || false);
  const [loading, setLoading] = useState(true);
  const [isBookmark, setIsBookmark] = useState(
    userProfile?.bookmarkBlogs?.some((bookmark) => bookmark._id === blog?._id) ||
      false
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const changeEventHandler = (e) => {
    setText(e.target.value);
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
        dispatch(setBlogs(updatedBlogs));
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
          dispatch(setUserProfile(updatedUserBlogs));
        }
      }
    } catch (error) {
      toast.error("Failed to update like status. Try again.", error);
    }
  };

  const commentHandler = async () => {
    const text = text.trim();
    if (!text.trim()) return toast.warning("Comment cannot be empty.");
    if (!user) return toast.error("You must be logged in to comment.");

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/blog/${blog._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success && res.data.comment) {
        const updatedBlogs = blogs.map((p) =>
          p._id === blog._id
            ? { ...p, comments: [res.data.comment, ...p.comments] }
            : p
        );
        dispatch(setBlogs(updatedBlogs));

        if (userProfile && userProfile._id === blog.author?._id) {
          const updatedUserBlogs = {
            ...userProfile,
            blogs: userProfile.blogs.map((p) =>
              p._id === blog._id
                ? { ...p, comments: [res.data.comment, ...p.comments] }
                : p
            ),
          };
          dispatch(setUserProfile(updatedUserBlogs));
        }
        setText("");
      } else {
        toast.error("Failed to Blog comment.");
      }
    } catch (error) {
      toast.error("An error occurred while posting the comment.");
      console.log(error);
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

  return (
    <div className="w-full max-w-xxl mx-auto p-6 mb-6">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Link
              to={`/profile/${author?._id}`}
              className="flex items-center gap-2"
            >
              {author && (
                <>
                  <Avatar size={"xs"} image={author?.profilePicture} />

                  <h1 className="font-medium">{author?.username}</h1>
                </>
              )}
            </Link>
            <BlogDialog blog={blog} />
          </div>

          {/* Blog Title */}
          <h2 className="text-lg font-semibold mt-2">{blog?.blogTitle}</h2>

          {/* Blog Description */}
          <div
            className="text-gray-700 my-2"
            dangerouslySetInnerHTML={{ __html: blog?.blogDiscription }}
          />

          {/* Blog Image/GIF */}
          {blog?.image && (
            <img
              src={blog?.image}
              alt="Blog"
              className="w-full h-auto max-h-[400px] object-cover rounded-lg mb-4"
            />
          )}
          {blog?.gifUrl && (
            <img
              src={blog?.gifUrl}
              alt="Blog GIF"
              className="w-full h-auto max-h-[400px] object-cover rounded-lg mb-4"
            />
          )}

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

              <MessageCircle
                onClick={() => setOpen(true)}
                className="cursor-pointer hover:text-gray-600"
              />
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

          <span className="font-medium block my-2">
            {blog?.likes.length} likes
          </span>

          {blog?.comments.length > 0 && (
            <span
              onClick={() => setOpen(true)}
              className="cursor-pointer text-sm text-gray-600"
            >
              View all {blog?.comments.length} comments
            </span>
          )}
          {/* Add Comment */}
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="Add a comment..."
              value={text}
              onChange={changeEventHandler}
              className="outline-none text-sm w-full"
            />
```

---

## src/components/BlogCommentDialog.jsx

```jsx
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { GoSmiley } from "react-icons/go";
import EmojiPicker from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { setBlogs } from "../redux/postSlice";
import axios from "axios";
import parse from "html-react-parser";
import { setUserProfile } from "../redux/authSlice";
import { toast } from "react-toastify";
import { Bookmark, BookmarkCheck, MessageCircle, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import BlogDialog from "./BlogDialog";

const BlogCommentDialog = ({ open, setOpen, blog }) => {
  const [text, setText] = useState("");
  const { user, userProfile } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { blogs } = useSelector((store) => store.post);
  const [comments, setComments] = useState(blog?.comments || []);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const dialogRef = useRef(null);
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
    if (blog) {
      setComments(blog?.comments);
    }
  }, [blog]);

  if (!open) return null;

  const handleEmojiModal = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (emoji) => {
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
        dispatch(setBlogs(updatedBlogs));
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
          dispatch(setUserProfile(updatedUserBlogs));
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
      const res = await axios.post(
        `http://localhost:8000/api/v1/blog/${blog._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success && res.data.comment) {
        const updatedBlogs = blogs.map((p) =>
          p._id === blog._id
            ? { ...p, comments: [res.data.comment, ...p.comments] }
            : p
        );
        dispatch(setBlogs(updatedBlogs));

        if (userProfile && userProfile._id === blog.author?._id) {
          const updatedUserBlogs = {
            ...userProfile,
            blogs: userProfile.blogs.map((b) =>
              b._id === blog._id
                ? { ...b, comments: [res.data.comment, ...b.comments] }
                : b
            ),
          };
          dispatch(setUserProfile(updatedUserBlogs));
        }
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
        className="bg-white rounded-lg shadow-lg max-w-4xl w-full flex flex-col max-h-screen h-screen overflow-y-auto custom-scrollbar"
      >
        <div className="p-4 flex flex-col gap-4 custom-scrollbar">
          {/* Author Info */}
          <div className="flex items-center gap-3">
            <Link to={`/profile/${author?._id}`}>
              <Avatar size="md" image={author?.profilePicture || ""} />
            </Link>
            <div>
              <Link
                to={`/profile/${author?._id}`}
                className="font-semibold text-lg hover:underline"
              >
                {author?.username || "Unknown"}
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
          <h2 className="text-xl font-bold">{blog?.blogTitle}</h2>
          <div className="text-gray-700 text-sm">
            {parse(blog?.blogDiscription)}
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
              <div key={c._id} className="flex items-start gap-3">
                <Avatar size="xs" image={c.author?.profilePicture || ""} />
                <div>
                  <p className="font-semibold text-sm">
                    {c.author?.username || "Unknown"}
                  </p>
                  <p className="text-gray-700">{c.text}</p>
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
```

---

## src/components/BlogDialog.jsx

```jsx
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setBlogs } from "../redux/postSlice.js";
import {
  setUserProfile,
  setSuggestedUsers,
  setAuthUser,
} from "../redux/authSlice.js";

function BlogDialog({ blog }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const dialogRef = useRef(null);
  const { user, userProfile, suggestedUsers } = useSelector(
    (store) => store.auth
  );
  const { blogs } = useSelector((store) => store.post);
  const author = blog?.author || null;

  // Check if the logged-in user is following the blog author
  const isFollowing = author
    ? userProfile?.followers.includes(author._id)
    : false;
  const [following, setFollowing] = useState(isFollowing);

  useEffect(() => {
    setFollowing(isFollowing); // Sync state when props change
  }, [isFollowing]);

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
  }, [open]);

  /** Follow/Unfollow Handler */
  const handleFollowToggle = async () => {
    if (!author) return;

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${author._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        const isFollowingNow = !following;
        setFollowing(isFollowingNow);

        const updatedAuthUser = {
          ...user,
          following: isFollowing
            ? user.following.filter((id) => id !== author?._id) // Remove from following
            : [...user.following, author?._id], // Add to following
        };

        dispatch(setAuthUser(updatedAuthUser));

        // Update `userProfile` if logged-in user is performing the action
        if (user._id === userProfile._id) {
          const updatedUserProfile = {
            ...userProfile,
            following: isFollowingNow
              ? [...userProfile.following, author?._id]
              : userProfile.following.filter((id) => id !== author?._id),
          };
          dispatch(setUserProfile(updatedUserProfile));
        }

        // Update `suggestedUsers` list
        const updatedSuggestedUsers = suggestedUsers.map((userItem) =>
          userItem._id === author._id
            ? {
                ...userItem,
                followers: isFollowingNow
                  ? [...userItem.followers, user._id]
                  : userItem.followers.filter((id) => id !== user._id),
              }
            : userItem
        );
        dispatch(setSuggestedUsers(updatedSuggestedUsers));

        // Update `userProfile.followers` if the logged-in user is viewing the author's profile
        if (userProfile._id === author._id) {
          const updatedProfile = {
            ...userProfile,
            followers: isFollowingNow
              ? [...userProfile.followers, user._id]
              : userProfile.followers.filter((id) => id !== user._id),
          };
          dispatch(setUserProfile(updatedProfile));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  /** Blog Deletion Handler */
  const deleteBlogHandler = async () => {
    if (!blog?._id) return;

    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/blog/delete/${blog._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        // Update Redux store
        const updatedBlogs = blogs.filter(
          (blogItem) => blogItem?._id !== blog?._id
        );
        dispatch(setBlogs(updatedBlogs));

        if (user._id === userProfile._id) {
          const updatedUserProfile = {
            ...userProfile,
            blogs: userProfile?.blogs.filter(
              (blogItem) => blogItem?._id !== blog._id
            ),
          };
          dispatch(setUserProfile(updatedUserProfile));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Open Dialog Button */}
      <button
        onClick={() => setOpen(true)}
        className="font-bold text-lg hover:text-gray-500 cursor-pointer"
      >
        <div className="mr-2 text-xl">...</div>
      </button>

      {/* Dialog Box Overlay */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          {/* Dialog Content */}
          <div ref={dialogRef} className="bg-white rounded-lg shadow-lg w-80">
            {/* Follow/Unfollow Button (only show if the author is not the logged-in user) */}
            {user && author && user._id !== author._id && (
              <button
                onClick={handleFollowToggle}
                className={`w-full py-2 rounded-t-lg border-b border-gray-300 hover:cursor-pointer ${
                  following
                    ? "bg-white text-red-500 hover:bg-gray-300"
                    : "text-blue-600 bg-white hover:bg-gray-300"
                }`}
              >
                {following ? "Unfollow" : "Follow"}
              </button>
            )}

            {/* Delete Button (only show if logged-in user is the author) */}
            {user && author && user._id === author._id && (
              <button
                onClick={deleteBlogHandler}
                className="w-full text-red-600 py-2 rounded-t-lg bg-white hover:bg-gray-300 border-b border-gray-300 hover:cursor-pointer"
              >
                Delete
              </button>
            )}

            {/* Add to Favourites Button */}
            <button
              onClick={() => setOpen(false)}
              className="w-full py-2 rounded-t-lg bg-white hover:bg-gray-300 border-b border-gray-300 hover:cursor-pointer"
            >
              Add to favourites
            </button>

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="w-full py-2 bg-white hover:bg-gray-300 rounded-b-lg border-b border-gray-300 hover:cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default BlogDialog;
```

---

## src/components/Blogs.jsx

```jsx
import { useSelector } from "react-redux";
import Blog from "./Blog";

function Blogs() {
  const { blogs = [] } = useSelector((store) => store.post); // Default to an empty array
  const { user } = useSelector((store) => store.auth);

  // Check if user is defined and has following
  const followingUsers = user?.following || [];

  // Filter blogs to only include those from users the current user is following
  const filteredBlogs = blogs.filter((blog) =>
    followingUsers.includes(blog?.author?._id)
  );

  return (
    <div>
      {filteredBlogs.length > 0 ? (
        // Display blogs if there are any
        filteredBlogs.map((blog) => <Blog key={blog._id} blog={blog} />)
      ) : (
        // Display a message if there are no blogs to show
        <div className="text-center mt-10 text-gray-500">
          <p>
            Follow users first to see their blogs. / The Users you follow does
            not upload any blogs.
          </p>
        </div>
      )}
    </div>
  );
}

export default Blogs;
```

---

## src/components/ChatPage.jsx

```jsx
import { useDispatch, useSelector } from "react-redux";
import Avatar from "./Avatar";
import { setMessages, setSelectedUser } from "../redux/chatSlice";
import { MessageCircleCode, Send } from "lucide-react";
import Messages from "./Messages";
import { useEffect, useState } from "react";
import axios from "axios";

function ChatPage() {
  const [textMessage, setTextMessage] = useState();
  const { user, suggestedUsers } = useSelector((store) => store.auth);
  const { selectedUser, onlineUsers, messages } = useSelector(
    (store) => store.chat
  );
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally, show a user-friendly error message
      alert("Failed to send message. Please try again.");
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  return (
    <div className=" w-[82%] h-[96%] fixed ml-60 flex flex-col md:flex-row bg-gray-100 border border-gray-300 rounded-xl shadow-lg">
      {/* Left Sidebar - Conversations */}
      <section className="w-full md:w-80 flex-shrink-0 border-r border-gray-200 bg-white h-full rounded-l-xl custom-scrollbar">
        <div className="p-4 sticky top-0 bg-white border-b border-gray-200 z-10 flex items-center gap-3 rounded-l-xl">
          <Avatar size="md" image={user?.profilePicture} />
          <h1 className="font-bold text-lg text-gray-800">Messages</h1>
        </div>
        <div className="p-4 overflow-y-auto">
          <h2 className="font-semibold text-gray-700 mb-3 ">Suggested Users</h2>
          {suggestedUsers && suggestedUsers.length > 0 ? (
            suggestedUsers.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser._id); // Check if the user is online
              return (
                <div
                  key={suggestedUser._id} // Use _id instead of id
                  onClick={() => dispatch(setSelectedUser(suggestedUser))}
                  className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-200"
                >
                  <Avatar size="md" image={suggestedUser?.profilePicture} />
                  <div className="ml-3 flex-1">
                    <span className="font-medium text-gray-800 block">
                      {suggestedUser?.username}
                    </span>
                    <span
                      className={`text-sm ${
                        isOnline ? "text-green-500" : "text-gray-500"
                      }`}
                    >
                      {isOnline ? "Active now" : "Offline"}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No suggested users available.</p>
          )}
        </div>
      </section>

      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col h-full bg-white rounded-xl">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10 rounded-tr-xl">
              <Avatar size="md" image={selectedUser?.profilePicture} />
              <div className="ml-3">
                <span className="font-semibold text-gray-800">
                  {selectedUser?.username}
                </span>
                <span
                  className={`text-sm block ${
                    onlineUsers.includes(selectedUser._id)
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {onlineUsers.includes(selectedUser._id) // Check if selected user is online
                    ? "Active now"
                    : "Offline"}
                </span>
              </div>
            </div>

            {/* Chat Messages */}
            <Messages selectedUser={selectedUser} />

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white flex items-center gap-3 sticky bottom-0 rounded-xl">
              <input
                type="text"
                placeholder="Type a message..."
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && textMessage.trim()) {
                    sendMessageHandler(selectedUser?._id);
                  }
                }}
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => sendMessageHandler(selectedUser?._id)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full flex items-center justify-center w-10 h-10"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-r-xl">
            <MessageCircleCode
              style={{ strokeWidth: "0.4" }}
              className="w-32 h-32 my-4 text-gray-500"
            />
            <span className="text-lg text-gray-500">
              Select a user to start chatting
            </span>
          </div>
        )}
      </section>
    </div>
  );
}

export default ChatPage;
```

---

## src/App.jsx

```jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUser } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import NotificationsPage from "./components/NotificationsPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Trending from "./components/Trending";
import Search from "./components/Search";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoutes>
            {" "}
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/account/edit",
        element: (
          <ProtectedRoutes>
            <EditProfile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoutes>
            <ChatPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/notifications",
        element: (
          <ProtectedRoutes>
            <NotificationsPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/trending",
        element: (
          <ProtectedRoutes>
            <Trending />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/search",
        element: (
          <ProtectedRoutes>
            <Search />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:8000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUser(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
```

---

## src/index.css

```css
@import "tailwindcss";

/* Custom Scrollbar Styling */

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #bababa;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #959595;
}

.blog-content ul {
  padding-left: 3rem;
}

.blog-content ol {
  padding-left: 2rem;
}

.blog-content ol {
  list-style-type: decimal;
}

.blog-content ul {
  list-style-type: disc;
}

.blog-content li {
  margin: 0.2rem 0;
}
```

---

## src/main.jsx

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";

let persistor = persistStore(store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
```

---

## src/redux/authSlice.js

```js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
    userProfile: null,
  },
  // ✅ Ensure initialState is an object
  reducers: {
    setAuthUser: (state, action) => {
      return { ...state, user: action.payload }; // ✅ Ensure state is always an object
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});

export const { setAuthUser, setSuggestedUsers, setUserProfile } =
  authSlice.actions;
export default authSlice.reducer;
```

---

## src/redux/chatSlice.js

```js
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedUser: null,
    onlineUsers: [],
    messages: [],
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setOnlineUser: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const { setSelectedUser, setOnlineUser, setMessages } =
  chatSlice.actions;
export default chatSlice.reducer;
```

---

## src/redux/postSlice.js

```js
import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    blogs: [],
  },
  reducers: {
    //actions
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
  },
});

export const { setPosts, setBlogs } = postSlice.actions;
export default postSlice.reducer;
```

---

## src/redux/rtnSlice.js

```js
import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [],
  },
  reducers: {
    setLikeNotification: (state, action) => {
      if (action.payload.type === "like") {
        state.likeNotification.push(action.payload);
      } else if (action.payload.type === "dislike") {
        state.likeNotification = state.likeNotification.filter(
          (item) => item.userId !== action.payload.userId
        );
      }
    },
    clearNotifications: (state) => {
      state.likeNotification = [];
    },
  },
});

export const { setLikeNotification, clearNotifications } = rtnSlice.actions;
export default rtnSlice.reducer;
```

---

## src/redux/socketSlice.js

```js
import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socketio",
  initialState: {
    socket: null,
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});
export const { setSocket } = socketSlice.actions;

export default socketSlice.reducer;
```

---

## src/redux/store.js

```js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import postSlice from "./postSlice.js";
import chatSlice from "./chatSlice.js";
import socketSlice from "./socketSlice.js";
import rtnSlice from "./rtnSlice.js";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  chat: chatSlice,
  socketio: socketSlice,
  realTimeNotification: rtnSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store); // ✅ Persistor added
export default store;
```

---

## src/hooks/useGetAllPosts.jsx

```jsx
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBlogs, setPosts } from "../redux/postSlice";

const useGetAllPosts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/post/all", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPost();
  }, [dispatch]);
  useEffect(() => {
    const fetchAllblogs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/blog/all", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setBlogs(res.data.blogs));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllblogs();
  }, [dispatch]);
};

export default useGetAllPosts;
```

---

## src/hooks/useGetAllMessage.jsx

```jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "../redux/chatSlice";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.chat);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllMessage = async () => {
      if (!selectedUser?._id) return; // Exit if no selected user

      setLoading(true);

      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/message/all/${selectedUser?._id}`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMessage();
  }, [dispatch, selectedUser]);

  return { loading }; // Return the loading state
};

export default useGetAllMessage;
```

---

## src/hooks/useGetRTM.jsx

```jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/chatSlice";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { messages } = useSelector((store) => store.chat);
  const { socket } = useSelector((store) => store.socketio);
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      dispatch(setMessages([...messages, newMessage]));
    });
    return () => {
      socket?.off("newMessage");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, setMessages]);
};

export default useGetRTM;
```

---

## src/hooks/useGetSuggestedUsers.jsx

```jsx
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "../redux/authSlice";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/user/suggested",
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestedUsers();
  }, []);
};

export default useGetSuggestedUsers;
```

---

## src/hooks/useGetUserProfile.jsx

```jsx
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../redux/authSlice";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/user/${userId}/profile`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserProfile();
  }, [userId, dispatch]);
};

export default useGetUserProfile;
```

---

## src/components/PostDialog.jsx

```jsx
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Toast from "./Toast";
import axios from "axios";
import { setPosts } from "../redux/postSlice.js";
import {
  setUserProfile,
  setSuggestedUsers,
  setAuthUser,
} from "../redux/authSlice.js";

function PostDialog({ post }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const dialogRef = useRef(null);
  const { user, userProfile, suggestedUsers } = useSelector(
    (store) => store.auth
  );
  const { posts } = useSelector((store) => store.post);
  const author = post?.author || null;

  // Check if the logged-in user is following the post author
  const isFollowing = author
    ? userProfile?.followers.includes(author._id)
    : false;
  const [following, setFollowing] = useState(isFollowing);

  useEffect(() => {
    setFollowing(isFollowing); // Sync state when props change
  }, [isFollowing]);

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
  }, [open]);

  /** Follow/Unfollow Handler */
  const handleFollowToggle = async () => {
    if (!author) return;

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${author._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        const isFollowingNow = !following;
        setFollowing(isFollowingNow);

        const updatedAuthUser = {
          ...user,
          following: isFollowing
            ? user.following.filter((id) => id !== author?._id) // Remove from following
            : [...user.following, author?._id], // Add to following
        };

        dispatch(setAuthUser(updatedAuthUser));

        // Update `userProfile` if logged-in user is performing the action
        if (user._id === userProfile._id) {
          const updatedUserProfile = {
            ...userProfile,
            following: isFollowingNow
              ? [...userProfile.following, author?._id]
              : userProfile.following.filter((id) => id !== author?._id),
          };
          dispatch(setUserProfile(updatedUserProfile));
        }

        // Update `suggestedUsers` list
        const updatedSuggestedUsers = suggestedUsers.map((userItem) =>
          userItem._id === author._id
            ? {
                ...userItem,
                followers: isFollowingNow
                  ? [...userItem.followers, user._id]
                  : userItem.followers.filter((id) => id !== user._id),
              }
            : userItem
        );
        dispatch(setSuggestedUsers(updatedSuggestedUsers));

        // Update `userProfile.followers` if the logged-in user is viewing the author's profile
        if (userProfile._id === author._id) {
          const updatedProfile = {
            ...userProfile,
            followers: isFollowingNow
              ? [...userProfile.followers, user._id]
              : userProfile.followers.filter((id) => id !== user._id),
          };
          dispatch(setUserProfile(updatedProfile));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  /** Post Deletion Handler */
  const deletePostHandler = async () => {
    if (!post?._id) return;

    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        // Update Redux store
        const updatedPosts = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPosts));

        if (user._id === userProfile._id) {
          const updatedUserProfile = {
            ...userProfile,
            posts: userProfile?.posts.filter(
              (postItem) => postItem?._id !== post._id
            ),
          };
          dispatch(setUserProfile(updatedUserProfile));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Open Dialog Button */}
      <button
        onClick={() => setOpen(true)}
        className="font-bold text-lg hover:text-gray-500 cursor-pointer"
      >
        <div className="mr-2 text-xl">...</div>
      </button>

      {/* Dialog Box Overlay */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          {/* Dialog Content */}
          <div ref={dialogRef} className="bg-white rounded-lg shadow-lg w-80">
            {/* Follow/Unfollow Button (only show if the author is not the logged-in user) */}
            {user && author && user._id !== author._id && (
              <button
                onClick={handleFollowToggle}
                className={`w-full py-2 rounded-t-lg border-b border-gray-300 hover:cursor-pointer ${
                  following
                    ? "bg-white text-red-500 hover:bg-gray-300"
                    : "text-blue-600 bg-white hover:bg-gray-300"
                }`}
              >
                {following ? "Unfollow" : "Follow"}
              </button>
            )}

            {/* Delete Button (only show if logged-in user is the author) */}
            {user && author && user._id === author._id && (
              <button
                onClick={deletePostHandler}
                className="w-full text-red-600 py-2 rounded-t-lg bg-white hover:bg-gray-300 border-b border-gray-300 hover:cursor-pointer"
              >
                Delete
              </button>
            )}

            {/* Add to Favourites Button */}
            <button
              onClick={() => setOpen(false)}
              className="w-full py-2 rounded-t-lg bg-white hover:bg-gray-300 border-b border-gray-300 hover:cursor-pointer"
            >
              Add to favourites
            </button>

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="w-full py-2 bg-white hover:bg-gray-300 rounded-b-lg border-b border-gray-300 hover:cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PostDialog;
```

---

## src/components/LeftSidebar.jsx

```jsx
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import { setSelectedUser } from "../redux/chatSlice";
import { useDispatch } from "react-redux";

function LeftSidebar() {
  const { user, userProfile, suggestedUsers } = useSelector(
    (store) => store.auth
  );
  const { selectedUser, onlineUsers } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = suggestedUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full md:w-80 flex-shrink-0 border-r border-gray-200 bg-white h-full rounded-l-xl custom-scrollbar">
      <div className="p-4 sticky top-0 bg-white border-b border-gray-200 z-10 flex items-center gap-3 rounded-l-xl">
        <Avatar size="md" image={user?.profilePicture} />
        <h1 className="font-bold text-lg text-gray-800">Messages</h1>
      </div>
      <div className="p-4 overflow-y-auto">
        <h2 className="font-semibold text-gray-700 mb-3 ">Suggested Users</h2>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
        />
        {filteredUsers.length > 0 ? (
          filteredUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser._id); // Check if the user is online
            return (
              <div
                key={suggestedUser._id} // Use _id instead of id
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-200"
              >
                <Avatar size="md" image={suggestedUser?.profilePicture} />
                <div className="ml-3 flex-1">
                  <span className="font-medium text-gray-800 block">
                    {suggestedUser?.username}
                  </span>
                  <span
                    className={`text-sm ${
                      isOnline ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    {isOnline ? "Active now" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
}

export default LeftSidebar;
```

---

## src/components/NotificationsPage.jsx

```jsx
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { useEffect, useState } from "react";
import axios from "axios";
import { setLikeNotification } from "../redux/rtnSlice";
import { setUserProfile } from "../redux/authSlice";
import { setBlogs } from "../redux/postSlice";

function NotificationsPage() {
  const { user, userProfile } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(likeNotification);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/user/${user._id}/notifications`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setLikeNotification(res.data.notifications));
          setNotifications(res.data.notifications);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user, dispatch]);

  useEffect(() => {
    setNotifications(likeNotification);
  }, [likeNotification]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <h2 className="text-2xl font-bold mb-4">No Notifications</h2>
        <p>You have no notifications yet. Start liking blogs!</p>
        <Link
          to="/"
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className="flex items-start gap-3 p-3 rounded-lg bg-gray-100"
          >
            <Avatar size="sm" image={notification.sender?.profilePicture} />
            <div>
              <p className="font-semibold text-sm">
                <Link to={`/profile/${notification.sender?._id}`}>
                  {notification.sender?.username}
                </Link>{" "}
                {notification.type === "like"
                  ? "liked your blog"
                  : "commented on your blog"}
              </p>
              <p className="text-xs text-gray-600">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
              <Link
                to={`/blog/${notification.blog?._id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View {notification.type === "like" ? "Blog" : "Comment"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsPage;
```

---

## src/components/CreateBlogDialog.jsx

```jsx
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setBlogs } from "../redux/postSlice.js";
import {
  setUserProfile,
  setSuggestedUsers,
  setAuthUser,
} from "../redux/authSlice.js";
import { toast } from "react-toastify";
import { Bookmark, BookmarkCheck, MessageCircle, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import BlogDialog from "./BlogDialog";

const CreateBlogDialog = ({ open, setOpen }) => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDiscription, setBlogDiscription] = useState("");
  const [image, setImage] = useState(null);
  const [gifUrl, setGifUrl] = useState(null);
  const { user, userProfile } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const dialogRef = useRef(null);

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

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("You need to be logged in to create a blog.");
    if (!blogTitle.trim() || !blogDiscription.trim()) {
      return toast.warning("Blog title and description cannot be empty.");
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("blogTitle", blogTitle);
      formData.append("blogDiscription", blogDiscription);
      if (image) formData.append("image", image);
      if (gifUrl) formData.append("gifUrl", gifUrl);

      const res = await axios.post(
        `http://localhost:8000/api/v1/blog/create`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setOpen(false);
        dispatch(setBlogs([res.data.blog, ...userProfile.blogs]));
      }
    } catch (error) {
      toast.error("Failed to create blog. Try again.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleGifUrlChange = (e) => {
    setGifUrl(e.target.value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div
        ref={dialogRef}
        className="bg-white rounded-lg shadow-lg max-w-2xl w-full flex flex-col max-h-screen h-screen overflow-y-auto custom-scrollbar"
      >
        <div className="p-4 flex flex-col gap-4 custom-scrollbar">
          <h2 className="text-xl font-bold">Create New Blog</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Blog Title"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <textarea
              placeholder="Blog Description (Markdown supported)"
              value={blogDiscription}
              onChange={(e) => setBlogDiscription(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="5"
              required
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleImageChange}
                className="p-2 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="url"
                placeholder="GIF URL (optional)"
                value={gifUrl}
                onChange={handleGifUrlChange}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Blog"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogDialog;
```

---

## src/components/CreatePostDialog.jsx

```jsx
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setPosts } from "../redux/postSlice.js";
import {
  setUserProfile,
  setSuggestedUsers,
  setAuthUser,
} from "../redux/authSlice.js";
import { toast } from "react-toastify";
import { Bookmark, BookmarkCheck, MessageCircle, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import PostDialog from "./PostDialog";

const CreatePostDialog = ({ open, setOpen }) => {
  const [postTitle, setPostTitle] = useState("");
  const [postDiscription, setPostDiscription] = useState("");
  const [image, setImage] = useState(null);
  const [gifUrl, setGifUrl] = useState(null);
  const { user, userProfile } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const dialogRef = useRef(null);

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

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("You need to be logged in to create a post.");
    if (!postTitle.trim() || !postDiscription.trim()) {
      return toast.warning("Post title and description cannot be empty.");
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("postTitle", postTitle);
      formData.append("postDiscription", postDiscription);
      if (image) formData.append("image", image);
      if (gifUrl) formData.append("gifUrl", gifUrl);

      const res = await axios.post(
        `http://localhost:8000/api/v1/post/create`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setOpen(false);
        dispatch(setPosts([res.data.post, ...userProfile.posts]));
      }
    } catch (error) {
      toast.error("Failed to create post. Try again.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleGifUrlChange = (e) => {
    setGifUrl(e.target.value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div
        ref={dialogRef}
        className="bg-white rounded-lg shadow-lg max-w-2xl w-full flex flex-col max-h-screen h-screen overflow-y-auto custom-scrollbar"
      >
        <div className="p-4 flex flex-col gap-4 custom-scrollbar">
          <h2 className="text-xl font-bold">Create New Post</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Post Title"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <textarea
              placeholder="Post Description (Markdown supported)"
              value={postDiscription}
              onChange={(e) => setPostDiscription(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="5"
              required
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleImageChange}
                className="p-2 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="url"
                placeholder="GIF URL (optional)"
                value={gifUrl}
                onChange={handleGifUrlChange}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostDialog;
```

---

## src/components/Profile.jsx

```jsx
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { useSelector, useDispatch } from "react-redux";
import { setUserProfile } from "../redux/authSlice";
import { setBlogs } from "../redux/postSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { Bookmark, BookmarkCheck, MessageCircle, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import BlogDialog from "./BlogDialog";
import PostDialog from "./PostDialog";

function Profile() {
  const { id } = useParams();
  const { user, userProfile, suggestedUsers } = useSelector(
    (store) => store.auth
  );
  const { blogs, posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/user/${id}/profile`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
          setCurrentUserProfile(res.data.user);
          setIsFollowing(res.data.isFollowing);
          setLiked(res.data.isLiked);
          setIsBookmark(res.data.isBookmarked);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, dispatch]);

  useEffect(() => {
    setIsFollowing(userProfile?.following.includes(id));
    setLiked(userProfile?.likes.some((like) => like._id === id));
    setIsBookmark(
      userProfile?.bookmarkBlogs?.some((bookmark) => bookmark._id === id)
    );
  }, [userProfile, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!currentUserProfile) {
    return (
      <div className="text-center py-10 text-gray-500">User not found.</div>
    );
  }

  const author = currentUserProfile;

  return (
    <div className="w-full max-w-xxl mx-auto p-6 mb-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="mr-2 text-xl">←</div>
          Back to Home
        </Link>
        {user && user._id === id && <PostDialog />}
      </div>

      <div className="flex items-center gap-3 mt-4">
        <Avatar size="lg" image={author?.profilePicture} />
        <div>
          <h1 className="font-bold text-2xl">{author?.username}</h1>
          <p className="text-gray-700">{author?.bio}</p>
          <p className="text-gray-600 text-sm">
            Joined on {new Date(author?.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <span>{author?.followers?.length || 0} Followers</span>
          <span>•</span>
          <span>{author?.following?.length || 0} Following</span>
          <span>•</span>
          <span>{author?.blogs?.length || 0} Blogs</span>
          <span>•</span>
          <span>{author?.posts?.length || 0} Posts</span>
        </div>
        {user && user._id === id && (
          <Link
            to="/account/edit"
            className="text-blue-600 hover:underline text-sm"
          >
            Edit Profile
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3 mt-4">
        <Link
          to={`/chat/${id}`}
          className="text-blue-600 hover:underline text-sm"
        >
          Send Message
        </Link>
        {user && user._id !== id && (
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`text-blue-600 hover:underline text-sm ${
              isFollowing ? "underline" : ""
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 mt-4">
        <Bookmark
          onClick={() => setIsBookmark(!isBookmark)}
          className={`cursor-pointer hover:text-gray-600 ${
            isBookmark ? "text-blue-600" : ""
          }`}
        />
        <PostDialog />
      </div>

      <div className="flex items-center gap-3 mt-4">
        <h2 className="font-medium text-lg">Blogs</h2>
        <BlogDialog />
      </div>

      <div className="flex items-center gap-3 mt-4">
        <h2 className="font-medium text-lg">Posts</h2>
        <PostDialog />
      </div>

      <div className="flex items-center gap-3 mt-4">
        <h2 className="font-medium text-lg">Liked Blogs</h2>
        <BlogDialog />
      </div>

      <div className="flex items-center gap-3 mt-4">
        <h2 className="font-medium text-lg">Liked Posts</h2>
        <PostDialog />
      </div>

      <div className="flex items-center gap-3 mt-4">
        <h2 className="font-medium text-lg">Bookmarked Blogs</h2>
        <BlogDialog />
      </div>

      <div className="flex items-center gap-3 mt-4">
        <h2 className="font-medium text-lg">Bookmarked Posts</h2>
        <PostDialog />
      </div>
    </div>
  );
}

export default Profile;
```

---

## src/components/Post.jsx

```jsx
/* eslint-disable react/prop-types */
import { Bookmark, BookmarkCheck, MessageCircle, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Avatar from "./Avatar";
import PostDialog from "./PostDialog";
import PostCommentDialog from "./PostCommentDialog";
import { setPosts } from "../redux/postSlice.js";
import { toast } from "react-toastify";
import { setUserProfile } from "../redux/authSlice.js";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const { user, userProfile } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);

  const author = post?.author;

  // States
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(post?.likes.includes(user?._id) || false);
  const [loading, setLoading] = useState(true);
  const [isBookmark, setIsBookmark] = useState(
    userProfile?.bookmarkPosts?.some((bookmark) => bookmark._id === post?._id) ||
      false
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const changeEventHandler = (e) => {
    setText(e.target.value);
  };

  const LikeOrDisLikeHandler = async () => {
    if (!user) return toast.error("You need to be logged in to like posts.");
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setLiked(!liked);
        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPosts));
        if (userProfile && userProfile._id === post.author?._id) {
          const updatedUserPosts = {
            ...userProfile,
            posts: userProfile.posts.map((p) =>
              p._id === post._id
                ? {
                    ...p,
                    likes: liked
                      ? p.likes.filter((id) => id !== user._id)
                      : [...p.likes, user._id],
                  }
                : p
            ),
          };
          dispatch(setUserProfile(updatedUserPosts));
        }
      }
    } catch (error) {
      toast.error("Failed to update like status. Try again.", error);
    }
  };

  const commentHandler = async () => {
    const text = text.trim();
    if (!text.trim()) return toast.warning("Comment cannot be empty.");
    if (!user) return toast.error("You must be logged in to comment.");

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success && res.data.comment) {
        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? { ...p, comments: [res.data.comment, ...p.comments] }
            : p
        );
        dispatch(setPosts(updatedPosts));

        if (userProfile && userProfile._id === post.author?._id) {
          const updatedUserPosts = {
            ...userProfile,
            posts: userProfile.posts.map((p) =>
              p._id === post._id
                ? { ...p, comments: [res.data.comment, ...p.comments] }
                : p
            ),
          };
          dispatch(setUserProfile(updatedUserPosts));
        }
        setText("");
      } else {
        toast.error("Failed to Post comment.");
      }
    } catch (error) {
      toast.error("An error occurred while posting the comment.");
      console.log(error);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post?._id}/bookmark`,
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

  return (
    <div className="w-full max-w-xxl mx-auto p-6 mb-6">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Link
              to={`/profile/${author?._id}`}
              className="flex items-center gap-2"
            >
              {author && (
                <>
                  <Avatar size={"xs"} image={author?.profilePicture} />

                  <h1 className="font-medium">{author?.username}</h1>
                </>
              )}
            </Link>
            <PostDialog post={post} />
          </div>

          {/* Post Title */}
          <h2 className="text-lg font-semibold mt-2">{post?.postTitle}</h2>

          {/* Post Description */}
          <div
            className="text-gray-700 my-2"
            dangerouslySetInnerHTML={{ __html: post?.postDiscription }}
          />

          {/* Post Image/GIF */}
          {post?.image && (
            <img
              src={post?.image}
              alt="Post"
              className="w-full h-auto max-h-[400px] object-cover rounded-lg mb-4"
            />
          )}
          {post?.gifUrl && (
            <img
              src={post?.gifUrl}
              alt="Post GIF"
              className="w-full h-auto max-h-[400px] object-cover rounded-lg mb-4"
            />
          )}

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

              <MessageCircle
                onClick={() => setOpen(true)}
                className="cursor-pointer hover:text-gray-600"
              />
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

          <span className="font-medium block my-2">
            {post?.likes.length} likes
          </span>

          {post?.comments.length > 0 && (
            <span
              onClick={() => setOpen(true)}
              className="cursor-pointer text-sm text-gray-600"
            >
              View all {post?.comments.length} comments
            </span>
          )}
          {/* Add Comment */}
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="Add a comment..."
              value={text}
              onChange={changeEventHandler}
              className="outline-none text-sm w-full"
            />
```

---

## src/components/Trending.jsx

```jsx
import { useSelector } from "react-redux";
import { useState } from "react";
import Blog from "./Blog";
import Post from "./Post";

function Trending() {
  const { blogs, posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);

  // Combine blogs and posts for trending
  const allContent = [...blogs, ...posts];

  // Sort by likes and comments
  allContent.sort((a, b) => {
    const likesDiff = (b.likes?.length || 0) - (a.likes?.length || 0);
    if (likesDiff !== 0) return likesDiff;
    return (b.comments?.length || 0) - (a.comments?.length || 0);
  });

  // Take top 10
  const trendingContent = allContent.slice(0, 10);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Trending</h1>
      <div className="space-y-4">
        {trendingContent.length > 0 ? (
          trendingContent.map((item) => (
            <div key={item._id} className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-700 text-sm">{item.description}</p>
              <p className="text-gray-600 text-xs mt-1">
                {item.likes?.length || 0} likes, {item.comments?.length || 0}{" "}
                comments
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No trending content yet.</p>
        )}
      </div>
    </div>
  );
}

export default Trending;
```

---

## src/components/CommentDialog.jsx

```jsx
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { GoSmiley } from "react-icons/go";
import EmojiPicker from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { setBlogs } from "../redux/postSlice";
import axios from "axios";
import parse from "html-react-parser";
import { setUserProfile } from "../redux/authSlice";
import { toast } from "react-toastify";
import { Bookmark, BookmarkCheck, MessageCircle, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import BlogDialog from "./BlogDialog";
import PostDialog from "./PostDialog";

const PostCommentDialog = ({ open, setOpen, post }) => {
  const [text, setText] = useState("");
  const { user, userProfile } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);
  const [comments, setComments] = useState(post?.comments || []);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const dialogRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const author = post?.author;

  // Like state
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);

  // Bookmark state
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
    if (post) {
      setComments(post?.comments);
    }
  }, [post]);

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
      const action = liked ? "dislike" : "like";
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setLiked(!liked);
        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setBlogs(updatedPosts));
        if (userProfile && userProfile._id === post.author?._id) {
          const updatedUserPosts = {
            ...userProfile,
            posts: userProfile.posts.map((p) =>
              p._id === post._id
                ? {
                    ...p,
                    likes: liked
                      ? p.likes.filter((id) => id !== user._id)
                      : [...p.likes, user._id],
                  }
                : p
            ),
          };
          dispatch(setUserProfile(updatedUserPosts));
        }
      }
    } catch (error) {
      toast.error("Failed to update like status. Try again.", error);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post?._id}/bookmark`,
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
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success && res.data.comment) {
        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? { ...p, comments: [res.data.comment, ...p.comments] }
            : p
        );
        dispatch(setBlogs(updatedPosts));

        if (userProfile && userProfile._id === post.author?._id) {
          const updatedUserPosts = {
            ...userProfile,
            posts: userProfile.posts.map((b) =>
              b._id === post._id
                ? { ...b, comments: [res.data.comment, ...b.comments] }
                : b
            ),
          };
          dispatch(setUserProfile(updatedUserPosts));
        }
        setText("");
      } else {
        toast.error("Failed to Post comment.");
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
        className="bg-white rounded-lg shadow-lg max-w-4xl w-full flex flex-col max-h-screen h-screen overflow-y-auto custom-scrollbar"
      >
        <div className="p-4 flex flex-col gap-4 custom-scrollbar">
          {/* Author Info */}
          <div className="flex items-center gap-3">
            <Link to={`/profile/${author?._id}`}>
              <Avatar size="md" image={author?.profilePicture || ""} />
            </Link>
            <div>
              <Link
                to={`/profile/${author?._id}`}
                className="font-semibold text-lg hover:underline"
              >
                {author?.username || "Unknown"}
              </Link>
              <p className="text-sm text-gray-500">
                {new Date(post?.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <PostDialog post={post} />
            </div>
          </div>

          {/* Post Title & Description */}
          <h2 className="text-xl font-bold">{post?.postTitle}</h2>
          <div className="text-gray-700 text-sm">
            {parse(post?.postDiscription)}
          </div>

          {/* Post Image / GIF */}
          {post?.image && (
            <img
              className="max-w-lg max-h-96 object-contain rounded-lg"
              src={post?.image}
              alt="Post"
            />
          )}
          {post?.gifUrl && (
            <img
              className="max-w-lg max-h-96 object-contain rounded-lg"
              src={post?.gifUrl}
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
          <span className="font-medium block">{post?.likes?.length} likes</span>
        </div>

        <hr />

        {/* Comments Section - Scrollable */}
        <p className="font-bold mx-4 my-2 text-2xl">Comments</p>
        <div className="flex-1 p-4 space-y-2">
          {comments.length > 0 ? (
            comments.map((c) => (
              <div key={c._id} className="flex items-start gap-3">
                <Avatar size="xs" image={c.author?.profilePicture || ""} />
                <div>
                  <p className="font-semibold text-sm">
                    {c.author?.username || "Unknown"}
                  </p>
                  <p className="text-gray-700">{c.text}</p>
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

export default PostCommentDialog;
```

---

## src/components/Search.jsx

```jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";

function Search() {
  const { user, userProfile, suggestedUsers } = useSelector(
    (store) => store.auth
  );
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = suggestedUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
      />
      {filteredUsers.length > 0 ? (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center p-2 rounded-lg hover:bg-gray-100"
            >
              <Link to={`/profile/${user._id}`}>
                <Avatar size="md" image={user?.profilePicture} />
              </Link>
              <div className="ml-3 flex-1">
                <Link
                  to={`/profile/${user._id}`}
                  className="font-semibold text-gray-800 hover:underline"
                >
                  {user?.username}
                </Link>
                <p className="text-sm text-gray-500">{user?.bio}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No users found.</p>
      )}
    </div>
  );
}

export default Search;
```

---

## src/components/SuggestedUsers.jsx

```jsx
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { setSelectedUser } from "../redux/chatSlice";

function SuggestedUsers() {
  const { user, userProfile, suggestedUsers } = useSelector(
    (store) => store.auth
  );
  const { selectedUser, onlineUsers } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  return (
    <div className="p-4 overflow-y-auto">
      <h2 className="font-semibold text-gray-700 mb-3 ">Suggested Users</h2>
      {suggestedUsers && suggestedUsers.length > 0 ? (
        suggestedUsers.map((suggestedUser) => {
          const isOnline = onlineUsers.includes(suggestedUser._id); // Check if the user is online
          return (
            <div
              key={suggestedUser._id} // Use _id instead of id
              onClick={() => dispatch(setSelectedUser(suggestedUser))}
              className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-200"
            >
              <Avatar size="md" image={suggestedUser?.profilePicture} />
              <div className="ml-3 flex-1">
                <span className="font-medium text-gray-800 block">
                  {suggestedUser?.username}
                </span>
                <span
                  className={`text-sm ${
                    isOnline ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  {isOnline ? "Active now" : "Offline"}
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500">No suggested users available.</p>
      )}
    </div>
  );
}

export default SuggestedUsers;
```

---

## src/components/Feed.jsx

```jsx
import { useState } from "react";
import Blogs from "./Blogs";
import Posts from "./Posts";

function Feed() {
  const [activeTab, setActiveTab] = useState("blogs");

  return (
    <div className="p-6">
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab("blogs")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "blogs"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Blogs
        </button>
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "posts"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Posts
        </button>
      </div>

      {activeTab === "blogs" ? <Blogs /> : <Posts />}
    </div>
  );
}

export default Feed;
```

---

## src/components/ProtectedRoutes.jsx

```jsx
/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ProtectedRoutes({ children }) {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Or a loading spinner
  }

  return children;
}

export default ProtectedRoutes;
```

---

## src/components/Messages.jsx

```jsx
/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";

function Messages() {
  const { user, userProfile, suggestedUsers } = useSelector(
    (store) => store.auth
  );
  const { selectedUser, onlineUsers, messages } = useSelector(
    (store) => store.chat
  );

  return (
    <div className="p-4 overflow-y-auto">
      <h2 className="font-semibold text-gray-700 mb-3 ">Messages</h2>
      {suggestedUsers && suggestedUsers.length > 0 ? (
        suggestedUsers.map((suggestedUser) => {
          const isOnline = onlineUsers.includes(suggestedUser._id); // Check if the user is online
          return (
            <div
              key={suggestedUser._id} // Use _id instead of id
              onClick={() => dispatch(setSelectedUser(suggestedUser))}
              className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-200"
            >
              <Avatar size="md" image={suggestedUser?.profilePicture} />
              <div className="ml-3 flex-1">
                <span className="font-medium text-gray-800 block">
                  {suggestedUser?.username}
                </span>
                <span
                  className={`text-sm ${
                    isOnline ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  {isOnline ? "Active now" : "Offline"}
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500">No suggested users available.</p>
      )}
    </div>
  );
}

export default Messages;
```

---

## src/components/RightSidebar.jsx

```jsx
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";

function RightSidebar() {
  const { user, userProfile } = useSelector((store) => store.auth);

  return (
    <div className="w-full md:w-80 flex-shrink-0 border-l border-gray-200 bg-white h-full rounded-r-xl custom-scrollbar">
      <div className="p-4 sticky top-0 bg-white border-b border-gray-200 z-10 flex items-center gap-3 rounded-r-xl">
        <Avatar size="md" image={user?.profilePicture} />
        <h1 className="font-bold text-lg text-gray-800">Profile</h1>
      </div>
      <div className="p-4 overflow-y-auto">
        <h2 className="font-semibold text-gray-700 mb-3 ">Your Profile</h2>
        <div className="flex items-center gap-3 mb-4">
          <Avatar size="lg" image={user?.profilePicture} />
          <div>
            <h3 className="font-bold text-xl">{user?.username}</h3>
            <p className="text-gray-700">{user?.bio}</p>
            <p className="text-gray-600 text-sm">
              Joined on {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Link
          to="/account/edit"
          className="w-full py-2 rounded-lg bg-blue-500 text-white text-center hover:bg-blue-600"
        >
          Edit Profile
        </Link>
        <Link
          to="/chat"
          className="w-full py-2 rounded-lg bg-green-500 text-white text-center hover:bg-green-600 mt-4"
        >
          Chat
        </Link>
        <Link
          to="/notifications"
          className="w-full py-2 rounded-lg bg-purple-500 text-white text-center hover:bg-purple-600 mt-4"
        >
          Notifications
        </Link>
        <Link
          to="/trending"
          className="w-full py-2 rounded-lg bg-orange-500 text-white text-center hover:bg-orange-600 mt-4"
        >
          Trending
        </Link>
        <Link
          to="/search"
          className="w-full py-2 rounded-lg bg-red-500 text-white text-center hover:bg-red-600 mt-4"
        >
          Search Users
        </Link>
      </div>
    </div>
  );
}

export default RightSidebar;
```

---

## src/components/Home.jsx

```jsx
import { Outlet } from "react-router-dom";
import Feed from "./Feed";

function Home() {
  return (
    <div className="w-full max-w-xxl mx-auto p-6">
      <Feed />
    </div>
  );
}

export default Home;
```

---

## src/components/MainLayout.jsx

```jsx
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

function MainLayout() {
  return (
    <div className="w-full h-full flex">
      <LeftSidebar />
      <Outlet />
      <RightSidebar />
    </div>
  );
}

export default MainLayout;
```

---

## src/components/Toast.jsx

```jsx
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useSelector } from "react-redux";

function Toast() {
  const { toastMessage, toastType } = useSelector((store) => store.toast);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (!showToast) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg z-50">
      <div className="flex items-center">
        {toastType === "success" ? (
          <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
        ) : (
          <XCircle className="h-6 w-6 text-red-500 mr-2" />
        )}
        <p className="text-sm">{toastMessage}</p>
      </div>
    </div>
  );
}

export default Toast;
```

---

## src/components/EditProfile.jsx

```jsx
import { useDispatch, useSelector } from "react-redux";
import Avatar from "./Avatar";
import { setUserProfile } from "../redux/authSlice";
import { useEffect, useState } from "react";
import axios from "axios";

function EditProfile() {
  const { user, userProfile } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [username, setUsername] = useState(userProfile?.username || "");
  const [bio, setBio] = useState(userProfile?.bio || "");
  const [profilePicture, setProfilePicture] = useState(
    userProfile?.profilePicture || ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUsername(userProfile?.username || "");
    setBio(userProfile?.bio || "");
    setProfilePicture(userProfile?.profilePicture || "");
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      if (profilePicture) formData.append("profilePicture", profilePicture);

      const res = await axios.put(
        `http://localhost:8000/api/v1/user/edit`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUserProfile(res.data.user));
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            disabled={loading}
          />
        </div>
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            disabled={loading}
          />
        </div>
        <div>
          <label
            htmlFor="profilePicture"
            className="block text-sm font-medium text-gray-700"
          >
            Profile Picture (optional)
          </label>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={loading}
          />
          {profilePicture && (
            <p className="mt-1 text-sm text-gray-500">
              Selected file: {profilePicture.name}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
```
