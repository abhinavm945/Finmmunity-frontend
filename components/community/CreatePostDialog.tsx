"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { api } from "../../utils/api";
import { GoSmiley } from "react-icons/go";
import EmojiPicker from "emoji-picker-react";
import Avatar from "../shared/Avatar";

interface CreatePostDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CreatePostDialog({
  open,
  setOpen,
}: CreatePostDialogProps) {
  const [postDiscription, setPostDiscription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDiscardPopup, setShowDiscardPopup] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: any) => state.user.user);
  const userProfile = useSelector((state: any) => state.user.userProfile);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        if (image || postDiscription) {
          setShowDiscardPopup(true);
        } else {
          setOpen(false);
        }
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen, image, postDiscription]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement).id !== "emoji-open") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target as Node)
        ) {
          setShowEmojiPicker(false);
        }
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  if (!open) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleEmojiClick = (emoji: any) => {
    setPostDiscription((prev) => prev + emoji.emoji);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) return alert("You need to be logged in to create a post.");
    if (!postDiscription.trim()) {
      return alert("Post description cannot be empty.");
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", postDiscription);
      if (image) formData.append("image", image);
      const response = await api.community.posts.create(formData);
      if (response.success) {
        alert("Post created successfully!");
        setOpen(false);
        setPostDiscription("");
        setImage(null);
        setImagePreview(null);
        window.location.reload();
      } else {
        alert(response.error?.message || "Failed to create post");
      }
    } catch (error) {
      alert("Failed to create post. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const discardPost = () => {
    setShowDiscardPopup(false);
    setImage(null);
    setImagePreview(null);
    setPostDiscription("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div
        ref={dialogRef}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl flex flex-col max-h-[90vh] overflow-y-auto border border-gray-200 mx-2 sm:mx-4"
      >
        <h2 className="text-md text-white text-center p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
          Create new post
        </h2>
        {!imagePreview ? (
          <div className="flex flex-col items-center justify-center p-10 rounded-lg">
            <label className="flex flex-col items-center cursor-pointer">
              <span className="text-5xl mb-4">📷</span>
              <span className="text-gray-500 font-semibold">
                Drag photos and videos here
              </span>
              <span className="mt-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer font-medium">
                Select from computer
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </span>
            </label>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 flex items-center justify-center border-r border-gray-200 p-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Uploaded"
                  className="w-full h-auto max-h-[400px] object-contain rounded-lg"
                />
              )}
            </div>
            <div className="md:w-1/2 p-4 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Avatar size="sm" image={user?.profilePicture} />
                <div>
                  <h1 className="font-semibold text-sm">{user?.username}</h1>
                  <span className="text-xs text-gray-500">{user?.bio}</span>
                </div>
              </div>
              <div className="relative w-full flex items-center border-b border-b-gray-300 p-2 mb-2">
                <GoSmiley
                  className="text-2xl top-0 cursor-pointer"
                  id="emoji-open"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />
                <textarea
                  value={postDiscription}
                  onChange={(e) => setPostDiscription(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full resize-none h-24 outline-none p-2"
                />
                {showEmojiPicker && (
                  <div
                    className="absolute top-10 left-10 z-40"
                    ref={emojiPickerRef}
                  >
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </div>
              <button
                onClick={handleSubmit}
                disabled={!postDiscription.trim() || loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Posting..." : "Share"}
              </button>
            </div>
          </div>
        )}
        {showDiscardPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
            <div className="bg-white rounded-lg shadow-lg w-[350px] text-center">
              <h3 className="pt-5 text-lg font-semibold mb-2">Discard post?</h3>
              <p className="text-sm text-gray-500 mb-4">
                If you leave, your edits would not be saved.
              </p>
              <div className="border-y border-gray-300">
                <button
                  className="w-full text-red-500 px-4 py-2 rounded"
                  onClick={discardPost}
                >
                  Discard
                </button>
              </div>
              <div>
                <button
                  className="w-full text-black px-4 py-2 rounded"
                  onClick={() => setShowDiscardPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
