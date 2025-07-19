"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { api } from "../../utils/api";
import { GoSmiley } from "react-icons/go";
import { ImAttachment } from "react-icons/im";
import { TbX } from "react-icons/tb";
import EmojiPicker from "emoji-picker-react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import Avatar from "../shared/Avatar";

interface CreateBlogDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CreateBlogDialog({
  open,
  setOpen,
}: CreateBlogDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [gifUrl, setGifUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifs, setGifs] = useState<any[]>([]);
  const [showDiscardPopup, setShowDiscardPopup] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const gifPickerRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: any) => state.user.user);
  const giphyFetch = new GiphyFetch("HgUrfU1ytCEXvrPP3ZW7iSi86LDJXhzD"); // Replace with your Giphy API key

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        if (image || title || content) {
          setShowDiscardPopup(true);
        } else {
          setOpen(false);
        }
      }
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
      if (
        gifPickerRef.current &&
        !gifPickerRef.current.contains(event.target as Node)
      ) {
        setShowGifPicker(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen, image, title, content]);

  useEffect(() => {
    if (showGifPicker) {
      fetchGifs("trending");
    }
  }, [showGifPicker]);

  if (!open) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
      setGifUrl(""); // Clear GIF if image is selected
    }
  };

  const handleEmojiClick = (emoji: { emoji: string }) => {
    setContent((prev) => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const fetchGifs = async (query: string) => {
    const { data } = await giphyFetch.search(query, { limit: 10 });
    setGifs(data);
  };

  const handleGifClick = (gif: { images: { original: { url: string } } }) => {
    setImage(null); // Clear image if GIF is selected
    setImagePreview(gif.images.original.url);
    setGifUrl(gif.images.original.url);
    setShowGifPicker(false);
  };

  const removeMedia = () => {
    setImage(null);
    setImagePreview(null);
    setGifUrl("");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) return alert("You need to be logged in to create a blog.");
    if (!title.trim() || !content.trim()) {
      return alert("Blog title and content cannot be empty.");
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }
      if (gifUrl && !image) {
        formData.append("gifUrl", gifUrl);
      }
      const response = await api.community.blogs.create(formData);
      if (response.success) {
        alert("Blog created successfully!");
        setOpen(false);
        setTitle("");
        setContent("");
        setImage(null);
        setImagePreview(null);
        setGifUrl("");
        window.location.reload();
      } else {
        alert(response.error?.message || "Failed to create blog");
      }
    } catch {
      alert("Failed to create blog. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const discardBlog = () => {
    setShowDiscardPopup(false);
    setImage(null);
    setImagePreview(null);
    setTitle("");
    setContent("");
    setGifUrl("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div
        ref={dialogRef}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl flex flex-col max-h-[90vh] overflow-y-auto border border-gray-200 mx-2 sm:mx-4"
      >
        <h2 className="text-md text-white text-center p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
          Create new blog
        </h2>
        <div className="p-6 flex flex-col gap-6 custom-scrollbar">
          <div className="flex items-center gap-3 mb-4">
            <Avatar size="sm" image={user?.profilePicture} />
            <div>
              <h1 className="font-semibold text-sm">{user?.username}</h1>
              <span className="text-xs text-gray-500">{user?.bio}</span>
            </div>
          </div>
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base mb-2"
            required
          />
          <div className="relative w-full flex items-center border-b border-b-gray-300 p-2 mb-2">
            <GoSmiley
              className="text-2xl top-0 cursor-pointer"
              id="emoji-open"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a description..."
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
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowGifPicker(false);
              }}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              😊
            </button>
            <button
              onClick={() => {
                setShowGifPicker(!showGifPicker);
                setShowEmojiPicker(false);
              }}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              GIF
            </button>
            <label className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
              <ImAttachment className="inline" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={!!imagePreview}
              />
            </label>
          </div>
          {imagePreview && (
            <div className="mb-4 relative group flex justify-center">
              <img
                src={imagePreview}
                alt="Uploaded"
                className="w-[50%] h-auto rounded-lg"
              />
              <button
                onClick={removeMedia}
                className="absolute top-5 left-1/2 transform -translate-x-1/2 -translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-300 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
              >
                <TbX className="w-5 h-5" />
              </button>
            </div>
          )}
          {showGifPicker && (
            <div
              ref={gifPickerRef}
              className="fixed z-50 bg-white p-4 rounded-lg shadow-lg"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "300px",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              <input
                type="text"
                placeholder="Search GIFs"
                onChange={(e) => fetchGifs(e.target.value)}
                className="w-full p-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="grid grid-cols-2 gap-2">
                {gifs.map((gif) => (
                  <img
                    key={gif.id}
                    src={gif.images.original.url}
                    alt="GIF"
                    className="cursor-pointer rounded-lg"
                    onClick={() => handleGifClick(gif)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t">
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Posting..." : "Publish Blog"}
          </button>
        </div>
        {showDiscardPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
            <div className="bg-white rounded-lg shadow-lg w-[350px] text-center">
              <h3 className="pt-5 text-lg font-semibold mb-2">Discard blog?</h3>
              <p className="text-sm text-gray-500 mb-4">
                If you leave, your edits would not be saved.
              </p>
              <div className="border-y border-gray-300">
                <button
                  className="w-full text-red-500 px-4 py-2 rounded"
                  onClick={discardBlog}
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
 