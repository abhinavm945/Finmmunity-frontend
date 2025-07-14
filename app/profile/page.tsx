"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../utils/api";

export default function ProfilePage() {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePicture, setProfilePicture] = useState<string | null>(
    user?.profilePicture || null
  );
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
          <p className="text-lg">You must be logged in to view your profile.</p>
          <button
            className="mt-4 text-blue-600 hover:underline"
            onClick={() => router.push("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setProfilePicture(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      if (file) {
        formData.append("profilePicture", file);
      }
      const response = await api.auth.updateProfile(formData);
      console.log("Profile update response:", response);
      if (response.success) {
        setSuccess("Profile updated successfully!");
      } else {
        setError(response.error?.message || "Failed to update profile.");
      }
    } catch (err: Error) {
      setError(err.message || "Failed to update profile.");
      console.error("Profile update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <img
              src={profilePicture || "/images/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-2 border"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="text-blue-600 hover:underline text-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Change Profile Picture
            </button>
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
            />
          </div>
          {success && <div className="text-green-600 text-sm">{success}</div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
