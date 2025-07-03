'use client';

import { useState } from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Avatar from '../shared/Avatar';
import CommentDialog from '../community/CommentDialog';
import BlogCommentDialog from '../community/BlogCommentDialog';
import RightSidebar from '../community/RightSidebar';
import PostCard from '../community/PostCard'; // Added import
import BlogCard from '../community/BlogCard'; // Added import
import { demoUsers, demoPosts, demoBlogs, Post, Blog } from '../../utils/demoData';

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('recent-content');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const { profileId } = useParams();
  const currentUser = demoUsers[0]; // Mock logged-in user
  const userProfile = demoUsers.find((user) => user._id === profileId) || currentUser;

  const isLoggedInUserProfile = currentUser._id === userProfile._id;
  const [isFollowing, setIsFollowing] = useState(
    currentUser.following.includes(userProfile._id)
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleOpenDialog = (post: Post) => {
    setSelectedPost(post);
  };

  const handleOpenBlogDialog = (blog: Blog) => {
    setSelectedBlog(blog);
  };

  const handleCloseDialog = () => {
    setSelectedPost(null);
  };

  const handleCloseBlogDialog = () => {
    setSelectedBlog(null);
  };

  const handleFollowOrUnfollow = () => {
    setIsFollowing(!isFollowing);
    if (isFollowing) {
      currentUser.following = currentUser.following.filter((id) => id !== userProfile._id);
      userProfile.followers = userProfile.followers.filter((id) => id !== currentUser._id);
    } else {
      currentUser.following.push(userProfile._id);
      userProfile.followers.push(currentUser._id);
    }
  };

  // Combine bookmarks for "saved" tab
  const savedItems = userProfile.bookmarks
    .map((bookmark) => {
      if (bookmark.type === 'post') {
        return demoPosts.find((post) => post._id === bookmark.id);
      } else {
        return demoBlogs.find((blog) => blog._id === bookmark.id);
      }
    })
    .filter((item): item is Post | Blog => item !== undefined);

  const displayedPosts =
    activeTab === 'posts'
      ? userProfile.posts
      : activeTab === 'saved'
      ? savedItems.filter((item): item is Post => !('title' in item))
      : [];

  const displayedBlogs =
    activeTab === 'blogs'
      ? userProfile.blogs
      : activeTab === 'saved'
      ? savedItems.filter((item): item is Blog => 'title' in item)
      : [];

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex max-w-7xl justify-center mr-5 mx-auto pl-10 md:pl-64">
      <div className="flex flex-col gap-10 p-6 w-full lg:w-3/4">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 ml-16">
          <section className="flex-shrink-0">
            <Avatar size="xl" image={userProfile.profilePicture} />
          </section>
          <section className="w-full text-center md:text-left">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 cursor-pointer">
                <span className="text-2xl font-semibold">{userProfile.username}</span>
                {isLoggedInUserProfile ? (
                  <div className="flex items-center gap-2">
                    <Link href="/account/edit">
                      <button className="hover:bg-gray-300 h-8 rounded-md bg-gray-200 px-4 cursor-pointer">
                        Edit profile
                      </button>
                    </Link>
                    <button className="hover:bg-gray-300 h-8 rounded-md bg-gray-200 px-4 cursor-pointer">
                      View Archive
                    </button>
                    <MdSettings
                      size={28}
                      className="hover:cursor-pointer text-gray-800"
                    />
                  </div>
                ) : isFollowing ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleFollowOrUnfollow}
                      className="bg-gray-200 hover:bg-gray-300 text-red-500 py-2 px-4 rounded-md text-sm cursor-pointer"
                    >
                      Unfollow
                    </button>
                    <button className="hover:bg-gray-300 h-8 rounded-md bg-gray-200 px-4 cursor-pointer">
                      Message
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleFollowOrUnfollow}
                    className="bg-[#179cf5] hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-md text-sm cursor-pointer"
                  >
                    Follow
                  </button>
                )}
              </div>
              <div className="flex justify-center md:justify-start gap-6 text-center md:text-left">
                <p>
                  <span className="font-semibold">{userProfile.blogs.length}</span> Blogs
                </p>
                <p>
                  <span className="font-semibold">{userProfile.posts.length}</span> Posts
                </p>
                <p className="cursor-pointer">
                  <span className="font-semibold">{userProfile.followers.length}</span> Followers
                </p>
                <p className="cursor-pointer">
                  <span className="font-semibold">{userProfile.following.length}</span> Following
                </p>
              </div>
              <div>
                <span>{userProfile.bio || 'Bio here.....'}</span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-300 pt-4">
          <div className="flex items-center justify-center gap-12 text-sm">
            {['recent-content', 'posts', 'blogs', 'tags', 'saved'].map((tab) => (
              <span
                key={tab}
                className={`py-3 cursor-pointer ${
                  activeTab === tab
                    ? 'font-bold border-b-2 border-gray-400'
                    : 'text-gray-500'
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab.toUpperCase().replace('-', ' ')}
              </span>
            ))}
          </div>
          {activeTab === 'recent-content' ? (
            <div className="flex flex-col mx-auto gap-4 max-w-lg">
              {userProfile.posts.length || userProfile.blogs.length ? (
                [...userProfile.posts, ...userProfile.blogs]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((item) =>
                    'title' in item ? (
                      <BlogCard key={item._id} blog={item} />
                    ) : (
                      <PostCard key={item._id} post={item} />
                    )
                  )
              ) : (
                <p className="text-center text-gray-500">No recent content available.</p>
              )}
            </div>
          ) : activeTab === 'blogs' ? (
            <div className="flex flex-col gap-4 max-w-xl mx-auto">
              {displayedBlogs.length > 0 ? (
                displayedBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
              ) : (
                <p className="text-center text-gray-500">No blogs available.</p>
              )}
            </div>
          ) : activeTab === 'posts' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {displayedPosts.length > 0 ? (
                displayedPosts.map((post) => (
                  <div
                    onClick={() => handleOpenDialog(post)}
                    key={post._id}
                    className="relative group cursor-pointer"
                  >
                    <img
                      src={post.image}
                      alt="postimage"
                      className="rounded-md w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center text-white space-x-4">
                        <button
                          className="flex items-center gap-2 hover:text-gray-300 cursor-pointer"
                        >
                          <span>{post.likes.length}</span>
                          {post.likes.includes(currentUser._id) ? (
                            <FaHeart size={22} className="text-red-500" />
                          ) : (
                            <FaRegHeart size={22} />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenDialog(post)}
                          className="flex items-center gap-2 hover:text-gray-300 cursor-pointer"
                        >
                          <span>{post.comments.length}</span>
                          <MessageCircle />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-3">No posts available.</p>
              )}
            </div>
          ) : activeTab === 'saved' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {savedItems.length > 0 ? (
                savedItems.map((item) =>
                  'title' in item ? (
                    <div
                      key={item._id}
                      className="relative group cursor-pointer"
                      onClick={() => handleOpenBlogDialog(item)}
                    >
                      <img
                        src={item.image}
                        alt="saved-item"
                        className="rounded-md w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center text-white space-x-4"></div>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={item._id}
                      className="relative group cursor-pointer"
                      onClick={() => handleOpenDialog(item)}
                    >
                      <img
                        src={item.image}
                        alt="saved-item"
                        className="rounded-md w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center text-white space-x-4"></div>
                      </div>
                    </div>
                  )
                )
              ) : (
                <p className="text-center text-gray-500 col-span-3">No saved items available.</p>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">No tags available.</p>
          )}
        </div>
      </div>
      {selectedPost && (
        <CommentDialog
          open={!!selectedPost}
          setOpen={handleCloseDialog}
          post={selectedPost}
        />
      )}
      {selectedBlog && (
        <BlogCommentDialog
          open={!!selectedBlog}
          setOpen={handleCloseBlogDialog}
          blog={selectedBlog}
        />
      )}
      <div className="hidden lg:block w-72 ml-auto">
        <RightSidebar />
      </div>
    </div>
  );
}