"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck, MessageCircle, Share2 } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Avatar from "../shared/Avatar";
import { motion } from "framer-motion";
import { api } from "../../utils/api";
import { Question } from "@/types/question";
import { Comment } from "@/types/comment";

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const [liked, setLiked] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [likingComment, setLikingComment] = useState<string | null>(null);

  // Fetch comments from backend
  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const res = await api.questions.getQuestionComments(
          String(question.id)
        );
        if (res.success && res.data && Array.isArray(res.data.comments)) {
          setComments(res.data.comments);
        } else {
          setComments([]);
        }
        console.log("Fetched comments:", res);
      } catch (err) {
        setComments([]);
        console.error("Error fetching comments:", err);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [question.id]);

  // Post a new comment to backend
  const handleComment = async () => {
    if (!commentText.trim()) return;
    setPostingComment(true);
    try {
      const res = await api.questions.addComment(String(question.id), {
        text: commentText,
      });
      if (res.success && res.data && res.data.comment) {
        setComments((prev) => [res.data.comment, ...prev]);
        setCommentText("");
      }
      console.log("Posted comment:", res);
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setPostingComment(false);
    }
  };

  // Like/unlike a comment
  const handleLikeComment = async (commentId: string) => {
    setLikingComment(commentId);
    try {
      const res = await api.questionsAPI.likeComment(commentId); // This should match your API
      // Refetch comments to update like count
      const updated = await api.questions.getQuestionComments(
        String(question.id)
      );
      if (
        updated.success &&
        updated.data &&
        Array.isArray(updated.data.comments)
      ) {
        setComments(updated.data.comments);
      }
      console.log("Liked comment:", res);
    } catch (err) {
      console.error("Error liking comment:", err);
    } finally {
      setLikingComment(null);
    }
  };

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
      alert("Share feature not supported on this browser.");
    }
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
          <Avatar
            size="sm"
            image={question.profilePicture || "/images/default-avatar.png"}
          />
          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              {question.author}
            </h3>
            <p className="text-xs text-gray-500">
              @{question.username} • {question.timestamp}
            </p>
          </div>
        </div>
      </div>
      <h4 className="text-base font-semibold text-gray-800 mb-2">
        {question.title}
      </h4>
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
            <MessageCircle
              size="18"
              className="cursor-pointer hover:text-gray-600"
            />
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
      {loadingComments ? (
        <div className="mb-4 text-gray-400 text-sm">Loading comments...</div>
      ) : (
        comments.length > 0 && (
          <div className="mb-4">
            {comments.slice(0, 2).map((comment) => (
              <div
                key={comment.id}
                className="flex items-center text-sm text-gray-600 mb-2 gap-2"
              >
                <span className="font-medium">
                  {comment.user?.username || comment.author}:
                </span>
                <span>{comment.text || comment.content}</span>
                <button
                  className={`ml-2 text-xs flex items-center gap-1 ${
                    likingComment === comment.id
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                  onClick={() => handleLikeComment(comment.id)}
                  disabled={likingComment === comment.id}
                  title="Like comment"
                >
                  <FaRegHeart
                    className="text-gray-400 hover:text-red-500"
                    size={14}
                  />
                  <span>{comment.likes || 0}</span>
                </button>
              </div>
            ))}
            {comments.length > 2 && (
              <span className="cursor-pointer text-xs text-blue-500 hover:underline">
                View all {comments.length} comments
              </span>
            )}
          </div>
        )
      )}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
          disabled={postingComment}
        />
        {commentText.trim() && (
          <button
            onClick={handleComment}
            className="px-4 py-2 bg-blue-500 text-white rounded-full text-xs font-medium hover:bg-blue-600"
            disabled={postingComment}
          >
            {postingComment ? "Posting..." : "Post"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
