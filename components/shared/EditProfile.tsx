"use client";

import { useRef, useState, useEffect } from "react";
import Avatar from "./Avatar";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../utils/api";
import { Loader2 } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

interface EditProfileProps {
  onSuccess?: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ onSuccess }) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Track if the user has started editing
  const [isDirty, setIsDirty] = useState(false);

  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture || "",
    bio: user?.bio || "",
    gender: user?.gender || "male",
    selectedFile: undefined as File | undefined,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sync form with user data if not dirty
  useEffect(() => {
    if (user && !isDirty) {
      setInput({
        profilePhoto: user.profilePicture || "",
        bio: user.bio || "",
        gender: user.gender || "male",
        selectedFile: undefined,
      });
    }
  }, [user, isDirty]);

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setInput((prev) => ({
        ...prev,
        profilePhoto: imageUrl,
        selectedFile: file,
      }));
      setIsDirty(true);
    }
  };

  const selectChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInput((prev) => ({ ...prev, gender: e.target.value }));
    setIsDirty(true);
  };

  const editProfileHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.selectedFile) {
      formData.append("profilePicture", input.selectedFile);
    }
    try {
      const res = await api.auth.updateProfile(formData);
      if (res.success) {
        setSuccess("Profile updated successfully!");
        // Fetch the latest user data from backend
        const freshUser = await api.auth.getCurrentUser();
        if (freshUser.success && setUser) {
          setUser(freshUser.data.user);
        }
        setIsDirty(false);
        if (onSuccess) onSuccess();
      } else {
        setError(res.error?.message || "Failed to update profile.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Mark form as dirty on input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, bio: e.target.value }));
    setIsDirty(true);
  };

  if (!isClient || !user) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full top-0">
      <form
        className="flex flex-col gap-6 w-full"
        onSubmit={editProfileHandler}
      >
        <h1 className="font-bold text-xl">Edit Profile</h1>
        {/* Profile Picture */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-100 rounded-xl p-4 gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Avatar
              size="lg"
              image={input.profilePhoto || user?.profilePicture}
            />
            <div className="items-center">
              <h1 className="font-bold text-sm break-all">{user?.username}</h1>
              <span className="text-gray-600 break-all">
                {input.bio || "No Bio..."}
              </span>
            </div>
          </div>
          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={fileChangeHandler}
          />
          <button
            type="button"
            onClick={() => imageRef.current?.click()}
            className="bg-blue-500 hover:bg-blue-700 text-white rounded-md py-2 px-4 w-full sm:w-auto"
          >
            Change Photo
          </button>
        </div>
        {/* Bio Input */}
        <div>
          <h1 className="font-semibold text-xl mb-2">Bio</h1>
          <input
            value={input.bio}
            onChange={handleInputChange}
            name="bio"
            type="text"
            className="border border-gray-200 rounded-md h-20 w-full p-2 resize-none"
            maxLength={200}
            placeholder="Tell us about yourself..."
          />
        </div>
        {/* Gender Selection */}
        <div>
          <h1 className="font-semibold mb-2">Gender</h1>
          <select
            value={input.gender}
            onChange={selectChangeHandler}
            className="w-full border border-gray-200 rounded-md py-2 px-2"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        {/* Success/Error Messages */}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 rounded-md py-2 px-4 text-white h-10 flex items-center justify-center disabled:opacity-50 w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
