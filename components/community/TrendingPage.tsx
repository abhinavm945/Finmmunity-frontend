import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFire,
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaRegCommentDots,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import Avatar from "../shared/Avatar";
import RightSidebar from "./RightSidebar";
import { fetchTrending } from "../../redux/communitySlice";

function Confetti({ show }: { show: boolean }) {
  // Simple confetti animation using CSS (for demo)
  return show ? (
    <div className="pointer-events-none absolute inset-0 z-50 flex justify-center items-center">
      <div className="animate-confetti w-32 h-32" />
      <style jsx>{`
        .animate-confetti {
          background: repeating-linear-gradient(
            135deg,
            #a5b4fc 0 10px,
            #f472b6 10px 20px,
            #facc15 20px 30px,
            #34d399 30px 40px,
            #a5b4fc 40px 50px
          );
          opacity: 0.7;
          border-radius: 50%;
          animation: pop 0.7s cubic-bezier(0.4, 2, 0.6, 1) 1;
        }
        @keyframes pop {
          0% {
            transform: scale(0.2) rotate(0deg);
            opacity: 0.8;
          }
          60% {
            transform: scale(1.2) rotate(20deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(-10deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  ) : null;
}

export default function TrendingPage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [likeState, setLikeState] = useState<{ [id: string]: boolean }>({});
  const [bookmarkState, setBookmarkState] = useState<{ [id: string]: boolean }>(
    {}
  );
  const [showConfetti, setShowConfetti] = useState<{ [id: string]: boolean }>(
    {}
  );
  const [commentModal, setCommentModal] = useState<{
    open: boolean;
    item: any;
  }>({ open: false, item: null });

  const dispatch = useDispatch();
  const { trending, loading } = useSelector((state: any) => state.community);

  useEffect(() => {
    if (!loading) {
      dispatch(fetchTrending());
    }
    // Only fetch on mount or when the page is visited
    // eslint-disable-next-line
  }, []);

  // Split trending into posts and blogs by type
  const trendingPosts = Array.isArray(trending)
    ? trending.filter((item) => item.type === "post")
    : [];
  const trendingBlogs = Array.isArray(trending)
    ? trending.filter((item) => item.type === "blog")
    : [];

  const handleLike = (id: string) => {
    setLikeState((prev) => ({ ...prev, [id]: !prev[id] }));
    setShowConfetti((prev) => ({ ...prev, [id]: true }));
    setTimeout(
      () => setShowConfetti((prev) => ({ ...prev, [id]: false })),
      800
    );
  };
  const handleBookmark = (id: string) => {
    setBookmarkState((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const handleComment = (item: any) => {
    setCommentModal({ open: true, item });
  };
  const closeCommentModal = () => setCommentModal({ open: false, item: null });

  const renderCard = (item: any, type: "post" | "blog") => (
    <motion.div
      key={item.id}
      whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(80,0,200,0.10)" }}
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all border border-gray-100 group"
    >
      <Confetti show={!!showConfetti[item.id]} />
      <div className="absolute z-10 top-3 left-3 flex items-center gap-2 bg-white/80 px-3 py-1 rounded-full shadow">
        <Avatar size="xs" image={item.user?.profilePicture} />
        <span className="text-sm font-medium text-gray-700">
          {item.user?.username}
        </span>
        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 font-semibold animate-pulse">
          {type === "post" ? "Post" : "Blog"}
        </span>
      </div>
      <img
        src={item.image || item.gifUrl || "/images/placeholder-post.jpg"}
        alt={type}
        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {type === "post" ? item.content : item.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
          {type === "post" ? item.content || "" : item.content || ""}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={() => handleLike(item.id)}
            className="flex items-center gap-1 text-pink-500 hover:text-pink-600 transition-colors"
          >
            {likeState[item.id] ? (
              <FaHeart className="animate-bounce" />
            ) : (
              <FaRegHeart />
            )}
            <span className="text-xs font-semibold">
              {likeState[item.id]
                ? (item.likes?.length || 0) + 1
                : item.likes?.length || 0}
            </span>
          </button>
          <button
            onClick={() => handleComment(item)}
            className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors"
          >
            <FaRegCommentDots />
            <span className="text-xs font-semibold">
              {item.comments?.length || 0}
            </span>
          </button>
          <button
            onClick={() => handleBookmark(item.id)}
            className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600 transition-colors"
          >
            {bookmarkState[item.id] ? <FaBookmark /> : <FaRegBookmark />}
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaShareAlt />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white py-8 px-2 md:px-8 relative overflow-x-hidden">
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-200 via-purple-200 to-white rounded-full blur-3xl opacity-30 animate-spin-slow" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-purple-200 via-blue-100 to-white rounded-full blur-2xl opacity-20 animate-pulse" />
      </div>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 relative z-10">
        <div className="flex-1">
          {/* Heading */}
          <div className="flex items-center gap-3 mb-6">
            <FaFire className="text-3xl text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text animate-bounce" />
            <h2 className="text-3xl font-extrabold italic bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Trending Now
            </h2>
          </div>
          {/* Tabs */}
          <div className="flex gap-8 mb-6 border-b border-gray-200">
            {[
              { label: "Posts", value: "posts" },
              { label: "Blogs", value: "blogs" },
            ].map((tab) => (
              <button
                key={tab.value}
                className={`relative pb-3 text-lg font-semibold transition-colors duration-200 focus:outline-none ${
                  activeTab === tab.value
                    ? "text-blue-700 after:absolute after:left-0 after:bottom-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 after:rounded-t"
                    : "text-gray-400 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <span className="text-lg text-gray-400">Loading...</span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "posts" ? (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                >
                  {trendingPosts.length > 0 ? (
                    trendingPosts.map((post) => renderCard(post, "post"))
                  ) : (
                    <div className="col-span-3 text-center text-gray-400 py-8">
                      No trending posts found.
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="blogs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                >
                  {trendingBlogs.length > 0 ? (
                    trendingBlogs.map((blog) => renderCard(blog, "blog"))
                  ) : (
                    <div className="col-span-3 text-center text-gray-400 py-8">
                      No trending blogs found.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
        {/* Right Sidebar: Who to follow */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <RightSidebar />
        </div>
      </div>
      {/* Comment Modal */}
      <AnimatePresence>
        {commentModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={closeCommentModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-2 text-blue-700">
                Quick Comment
              </h3>
              <p className="text-gray-700 mb-4">
                Leave your thoughts on{" "}
                <span className="font-semibold">
                  {commentModal.item?.title || commentModal.item?.content}
                </span>
              </p>
              <textarea
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-300"
                rows={3}
                placeholder="Type your comment..."
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeCommentModal}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition-all">
                  Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
