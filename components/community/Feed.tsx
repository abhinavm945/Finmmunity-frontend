'use client';

import { useState } from 'react';
import PostList from './PostList';
import BlogList from './BlogList';
import { demoUsers, demoPosts, demoBlogs, Post, Blog } from '../../utils/demoData';
import { usePathname } from 'next/navigation';
import BlogCard from './BlogCard';
import PostCard from './PostCard';

// Mock logged-in user
const currentUser = demoUsers[0];

export default function Feed() {
  const [activeTab, setActiveTab] = useState('Blogs');
  const pathname = usePathname();

  // Get bookmarked items for Watchlist
  const bookmarkedItems: Array<Post | Blog> = currentUser.bookmarks
    .map((bookmark) => {
      if (bookmark.type === 'post') {
        return demoPosts.find((post) => post._id === bookmark.id);
      } else {
        return demoBlogs.find((blog) => blog._id === bookmark.id);
      }
    })
    .filter((item): item is Post | Blog => item !== undefined);

  return (
    <>
      <div className="flex items-center justify-center gap-8 text-sm border-b">
        {['Blogs', 'Posts', 'Watchlist'].map((tab) => (
          <button
            key={tab}
            className={`py-4 px-2 font-medium ${
              activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="my-4">
        {activeTab === 'Posts' ? (
          <PostList posts={demoPosts} />
        ) : activeTab === 'Blogs' ? (
          <BlogList blogs={demoBlogs} />
        ) : (
          <div className="space-y-4 max-w-7xl mx-auto px-4 py-6">
            {bookmarkedItems.length > 0 ? (
              bookmarkedItems.map((item) =>
                'title' in item ? (
                  <BlogCard key={item._id} blog={item} />
                ) : (
                  <PostCard key={item._id} post={item} />
                )
              )
            ) : (
              <p className="text-center text-gray-500">No items in watchlist.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}