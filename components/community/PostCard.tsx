"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MessageCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import { Post } from "../../utils/types";
import { useCommunity } from "../../hooks/useApi";
import CommentDialog from "./CommentDialog";
import Avatar from "../shared/Avatar";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const user = useSelector((state) => state.user?.user);
  const { posts, bookmarks } = useCommunity();

  const [isLiked, setIsLiked] = useState(post.likes.includes(user?.id || ""));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [openCommentDialog, setOpenCommentDialog] = useState(false);

  const handleLike = async () => {
    if (!user) return;

    try {
      if (isLiked) {
        await posts.unlike.execute({ id: post.id });
        setLikeCount((prev) => prev - 1);
      } else {
        await posts.like.execute({ id: post.id });
        setLikeCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleBookmark = async () => {
    if (!user) return;

    try {
      if (isBookmarked) {
        await bookmarks.remove.execute({ id: post.id });
      } else {
        await bookmarks.add.execute({ type: "POST", postId: post.id });
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href={`/profile/${post.user.id}`}>
          <Avatar image={post.user.profilePicture} size="md" />
        </Link>
        <div>
          <Link href={`/profile/${post.user.id}`}>
            <p className="font-semibold text-gray-800 hover:underline">
              {post.user.username}
            </p>
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
