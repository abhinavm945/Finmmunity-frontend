'use client';

import Avatar from '../shared/Avatar';
import { Comment } from '../../utils/demoData';
import { formatDate } from '../../utils/formatDate';

interface CommentCardProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="flex items-start gap-2 p-2">
      <Avatar size="xs" image={comment.profilePicture || '/images/default-avatar.png'} />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{comment.username}</span>
          <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
        </div>
        <p className="text-sm">{comment.content}</p>
      </div>
    </div>
  );
}