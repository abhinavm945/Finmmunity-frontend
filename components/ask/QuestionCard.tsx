'use client';

import { useState } from 'react';
import { Bookmark, BookmarkCheck, MessageCircle, Share2 } from 'lucide-react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Avatar from '../shared/Avatar';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: {
    id: number;
    title: string;
    content: string;
    author: string;
    username: string;
    profilePicture?: string;
    likes: number;
    comments: { id: number; author: string; text: string }[];
    timestamp: string;
  };
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const [liked, setLiked] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(question.comments);

  const handleLike = () => setLiked(!liked);
  const handleBookmark = () => setIsBookmark(!isBookmark);
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: question.title,
        text: question.content,
        url: window.location.href,
      });
    } else {
      alert('Share feature not supported on this browser.');
    }
  };
  const handleComment = () => {
    if (!commentText.trim()) return;
    setComments([
      { id: comments.length + 1, author: 'CurrentUser', text: commentText },
      ...comments,
    ]);
    setCommentText('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar size="sm" image={question.profilePicture || '/images/default-avatar.png'} />
          <div>
            <h3 className="text-sm font-semibold text-gray-800">{question.author}</h3>
            <p className="text-xs text-gray-500">@{question.username} • {question.timestamp}</p>
          </div>
        </div>
      </div>
      <h4 className="text-base font-semibold text-gray-800 mb-2">{question.title}</h4>
      <p className="text-sm text-gray-600 mb-4">{question.content}</p>
      <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {liked ? (
              <FaHeart
                size="18"
                className="cursor-pointer text-red-600 hover:text-gray-600"
                onClick={handleLike}
              />
            ) : (
              <FaRegHeart
                size="18"
                className="cursor-pointer hover:text-gray-600"
                onClick={handleLike}
              />
            )}
            <span>{question.likes + (liked ? 1 : 0)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size="18" className="cursor-pointer hover:text-gray-600" />
            <span>{comments.length}</span>
          </div>
          <Share2
            size="18"
            className="cursor-pointer hover:text-gray-600"
            onClick={handleShare}
          />
        </div>
        {isBookmark ? (
          <BookmarkCheck
            size="18"
            className="cursor-pointer hover:text-gray-600"
            onClick={handleBookmark}
          />
        ) : (
          <Bookmark
            size="18"
            className="cursor-pointer hover:text-gray-600"
            onClick={handleBookmark}
          />
        )}
      </div>
      {comments.length > 0 && (
        <div className="mb-4">
          {comments.slice(0, 2).map((comment) => (
            <div key={comment.id} className="text-sm text-gray-600 mb-2">
              <span className="font-medium">{comment.author}: </span>
              {comment.text}
            </div>
          ))}
          {comments.length > 2 && (
            <span className="cursor-pointer text-xs text-blue-500 hover:underline">
              View all {comments.length} comments
            </span>
          )}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
        />
        {commentText.trim() && (
          <button
            onClick={handleComment}
            className="px-4 py-2 bg-blue-500 text-white rounded-full text-xs font-medium hover:bg-blue-600"
          >
            Post
          </button>
        )}
      </div>
    </motion.div>
  );
}