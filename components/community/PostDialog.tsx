/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const PostDialog = ({ post }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const dialogRef = useRef(null);
  const user = useSelector((store) => store.user.user);
  const userProfile = useSelector((store) => store.user.profile);
  const suggestedUsers = useSelector((store) => store.user.suggestedUsers);
  const posts = useSelector((store) => store.community.posts);
  const author = post?.author || null;
  const isFollowing = author
    ? userProfile?.followers.includes(author._id)
    : false;
  const [following, setFollowing] = useState(isFollowing);

  useEffect(() => {
    setFollowing(isFollowing);
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

  const handleFollowToggle = async () => {
    if (!author) return;
    try {
      const res = await axios.post(
        `/api/v1/user/followorunfollow/${author._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        const isFollowingNow = !following;
        setFollowing(isFollowingNow);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const deletePostHandler = async () => {
    if (!post?._id) return;
    try {
      const res = await axios.delete(`/api/v1/post/delete/${post._id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Post Deleted Successfully");
        setTimeout(() => setOpen(false), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="font-bold text-lg hover:text-gray-500 cursor-pointer"
      >
        <div className="mr-2 text-xl">...</div>
      </button>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div ref={dialogRef} className="bg-white rounded-lg shadow-lg w-80">
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
            {user && author && user._id === author._id && (
              <button
                onClick={deletePostHandler}
                className="w-full text-red-600 py-2 rounded-t-lg bg-white hover:bg-gray-300 border-b border-gray-300 hover:cursor-pointer"
              >
                Delete
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="w-full py-2 rounded-t-lg bg-white hover:bg-gray-300 border-b border-gray-300 hover:cursor-pointer"
            >
              Add to favourites
            </button>
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
};

export default PostDialog;
