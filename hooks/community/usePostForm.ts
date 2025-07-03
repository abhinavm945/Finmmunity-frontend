'use client';

import { useState } from 'react';

export default function usePostForm() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (callback: () => void) => {
    if (title.trim() && content.trim()) {
      callback();
      setTitle('');
      setContent('');
      setTags('');
      setOpen(false);
    }
  };

  return { open, setOpen, title, setTitle, content, setContent, tags, setTags, handleSubmit };
}