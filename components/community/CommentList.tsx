"use client";

import CommentCard from "./CommentCard";
import { Comment } from "../../utils/types";

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
