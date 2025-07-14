"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import CommentList from "./CommentList";
import { Post } from "../../utils/types";
import { RootState } from "../../store";
import { useCommunity } from "../../hooks/useApi";
import Avatar from "../shared/Avatar";

interface CommentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  post: Post;
}

export default function CommentDialog({
  open,
  setOpen,
  post,
}: CommentDialogProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { comments } = useCommunity();
  const [commentText, setCommentText] = useState("");

  const handleComment = async () => {
    if (!commentText.trim() || !user) return;

    try {
      await comments.create.execute({
        content: commentText,
        postId: post.id,
      });
      setCommentText("");
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Comments for Post</h3>
          <button onClick={() => setOpen(false)}>
            <FiX className="text-xl" />
          </button>
        </div>
        <CommentList comments={post.comments} />
        <div className="flex items-center gap-2 mt-4">
          <Avatar size="xs" image={user?.profilePicture} />
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
          />
          <button
            onClick={handleComment}
            className="text-blue-600 font-semibold text-sm"
            disabled={!commentText.trim()}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
