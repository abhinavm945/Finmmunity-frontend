'use client';

import { useState } from 'react';
import { Bookmark, BookmarkCheck, MessageCircle, Send } from 'lucide-react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Avatar from '../shared/Avatar';
import { motion } from 'framer-motion';
import BlogCommentDialog from './BlogCommentDialog';
import { Blog, demoBlogs, demoUsers } from '../../utils/demoData';
import { formatDate } from '../../utils/formatDate';
import { truncateText } from '../../utils/truncateText';

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const [liked, setLiked] = useState(blog.likes.includes(demoUsers[0]._id));
  const [isBookmarked, setIsBookmarked] = useState(blog.isBookmarked);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    const updatedLikes = liked
      ? blog.likes.filter((id) => id !== demoUsers[0]._id)
      : [...blog.likes, demoUsers[0]._id];
    blog.likes = updatedLikes;
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    blog.isBookmarked = !isBookmarked;
    const user = demoUsers[0];
    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((b) => b.id !== blog._id);
    } else {
      user.bookmarks.push({ type: 'blog', id: blog._id });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href + `/blog/${blog._id}`);
    alert('Link copied to clipboard!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-lg mx-auto p-6 mb-6 bg-white rounded-lg shadow-sm border border-gray-200"
    >
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* Blog Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Avatar size="xs" image={blog.profilePicture || '/images/default-avatar.png'} />
              <h1 className="font-medium text-gray-900">{blog.username}</h1>
            </div>
            <span className="text-sm text-gray-500">{formatDate(blog.createdAt)}</span>
          </div>

          {/* Blog Image */}
          {blog.image && (
            <img
              className="rounded-sm my-2 aspect-square object-cover w-full"
              src={blog.image}
              alt="Blog"
            />
          )}

          {/* Blog Title and Content */}
          <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
          <p>{truncateText(blog.content, 100)}</p>

          {/* Blog Actions */}
          <div className="flex justify-between items-center mb-2 mt-3">
            <div className="flex items-center gap-3">
              {liked ? (
                <FaHeart
                  size="23px"
                  className="cursor-pointer text-red-600 hover:text-gray-600"
                  onClick={handleLike}
                />
              ) : (
                <FaRegHeart
                  size="23px"
                  className="cursor-pointer hover:text-gray-600"
                  onClick={handleLike}
                />
              )}
              <MessageCircle
                className="cursor-pointer hover:text-gray-600"
                onClick={() => setShowComments(true)}
              />
              <Send
                className="cursor-pointer hover:text-gray-600"
                onClick={handleShare}
              />
            </div>
            {isBookmarked ? (
              <BookmarkCheck
                className="cursor-pointer hover:text-gray-600"
                onClick={handleBookmark}
              />
            ) : (
              <Bookmark
                className="cursor-pointer hover:text-gray-600"
                onClick={handleBookmark}
              />
            )}
          </div>

          {/* Likes and Comments Count */}
          <div className="my-2">
            <span className="font-medium block">{blog.likes.length} likes</span>
            {blog.comments.length > 0 && (
              <span
                className="cursor-pointer text-sm text-gray-600 block"
                onClick={() => setShowComments(true)}
              >
                View all {blog.comments.length} comments
              </span>
            )}
          </div>

          {/* Comment Dialog */}
          {showComments && (
            <BlogCommentDialog
              open={showComments}
              setOpen={setShowComments}
              blog={blog}
            />
          )}
        </>
      )}
    </motion.div>
  );
}