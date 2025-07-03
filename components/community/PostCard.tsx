'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { MessageCircle, Bookmark, BookmarkCheck } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { Post, demoPosts, demoUsers } from '../../utils/demoData';
import CommentDialog from './CommentDialog';
import Avatar from '../shared/Avatar';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.likes.includes(demoUsers[0]._id));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [openCommentDialog, setOpenCommentDialog] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    if (isLiked) {
      post.likes = post.likes.filter((id) => id !== demoUsers[0]._id);
    } else {
      post.likes.push(demoUsers[0]._id);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    post.isBookmarked = !isBookmarked;
    const user = demoUsers[0];
    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((b) => b.id !== post._id);
    } else {
      user.bookmarks.push({ type: 'post', id: post._id });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href={`/profile/${post.userId}`}>
          <Avatar image={post.profilePicture} size="md" />
        </Link>
        <div>
          <Link href={`/profile/${post.userId}`}>
            <p className="font-semibold text-gray-800 hover:underline">{post.username}</p>
          </Link>
          <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
        </div>
      </div>
      <p className="mt-3 text-gray-700">{post.content}</p>
      {post.image && (
        <div className="mt-3">
          <Image
            src={post.image}
            alt="Post image"
            width={500}
            height={300}
            className="rounded-md object-cover w-full"
          />
        </div>
      )}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-gray-600 hover:text-red-500"
          >
            {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            <span>{likeCount}</span>
          </button>
          <button
            onClick={() => setOpenCommentDialog(true)}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-500"
          >
            <MessageCircle size={20} />
            <span>{post.comments.length}</span>
          </button>
        </div>
        <button
          onClick={handleBookmark}
          className="text-gray-600 hover:text-blue-500"
        >
          {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </button>
      </div>
      {openCommentDialog && (
        <CommentDialog
          open={openCommentDialog}
          setOpen={() => setOpenCommentDialog(false)}
          post={post}
        />
      )}
    </div>
  );
}