'use client';

import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { demoPosts, demoBlogs, demoUsers } from '../../utils/demoData';

interface PostFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isBlog?: boolean;
}

export default function PostForm({ open, setOpen, isBlog = false }: PostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Date.now().toString();
    const user = demoUsers[0];
    const imageUrl = image ? URL.createObjectURL(image) : '/images/placeholder-post.jpg';

    if (isBlog) {
      const newBlog = {
        _id: newId,
        userId: user._id,
        username: user.username,
        profilePicture: user.profilePicture,
        title,
        content,
        image: imageUrl,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
        isBookmarked: false,
      };
      demoBlogs.push(newBlog);
      user.blogs.push(newBlog);
    } else {
      const newPost = {
        _id: newId,
        userId: user._id,
        username: user.username,
        profilePicture: user.profilePicture,
        content,
        image: imageUrl,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
        isBookmarked: false,
      };
      demoPosts.push(newPost);
      user.posts.push(newPost);
    }

    setTitle('');
    setContent('');
    setTags('');
    setImage(null);
    setOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="font-bold">{isBlog ? 'Share Market Analysis' : 'Create Post'}</h3>
          <button onClick={() => setOpen(false)}>
            <FiX className="text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          {isBlog && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Title of your analysis"
                className="w-full p-2 border-b border-gray-300 focus:border-blue-500 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          )}
          <div className="mb-4">
            <textarea
              placeholder={isBlog ? 'Share your detailed analysis...' : 'What’s on your mind?'}
              className="w-full p-2 border border-gray-300 rounded-lg h-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          {!isBlog && (
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tags (comma separated) e.g. stocks, tech, earnings"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isBlog ? 'Publish Analysis' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}