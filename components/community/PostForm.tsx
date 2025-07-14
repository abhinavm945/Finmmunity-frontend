"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiX } from "react-icons/fi";
import { api } from "../../utils/api";

interface PostFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isBlog?: boolean;
}

export default function PostForm({
  open,
  setOpen,
  isBlog = false,
}: PostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError("User ID not found in URL!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("content", content);

      if (isBlog) {
        formData.append("title", title);
        if (tags) formData.append("tags", tags);
      }

      if (image) {
        formData.append("image", image);
      }

      let response;
      if (isBlog) {
        response = await api.community.blogs.create(formData);
        console.log("Create blog response:", response);
      } else {
        response = await api.community.posts.create(formData);
        console.log("Create post response:", response);
      }

      if (response.success) {
        alert(
          isBlog ? "Blog shared successfully!" : "Post created successfully!"
        );
        setTitle("");
        setContent("");
        setTags("");
        setImage(null);
        setOpen(false);
        // Optionally refresh the page or update the feed
        window.location.reload();
      } else {
        setError(
          response.error?.message ||
            `Failed to create ${isBlog ? "blog" : "post"}`
        );
      }
    } catch (err: Error) {
      setError(err.message || `Error creating ${isBlog ? "blog" : "post"}`);
      console.error(`Error creating ${isBlog ? "blog" : "post"}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="font-bold">
            {isBlog ? "Share Market Analysis" : "Create Post"}
          </h3>
          <button onClick={() => setOpen(false)}>
            <FiX className="text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          {isBlog && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Title of your analysis"
                className="w-full p-2 border-b border-gray-300 focus:border-blue-500 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          )}
          <div className="mb-4">
            <textarea
              placeholder={
                isBlog
                  ? "Share your detailed analysis..."
                  : "What's on your mind?"
              }
              className="w-full p-2 border border-gray-300 rounded-lg h-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          {!isBlog && (
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}
          {isBlog && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tags (comma-separated)"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          )}
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : isBlog
                ? "Share Analysis"
                : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
