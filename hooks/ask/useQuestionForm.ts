'use client';

import { useState } from 'react';

export default function useQuestionForm() {
  const [newQuestion, setNewQuestion] = useState('');

  const handleSubmitQuestion = (questions: any[], setQuestions: (questions: any[]) => void, callback?: () => void) => {
    if (newQuestion.trim() === '') return;

    const newQ = {
      id: questions.length + 1,
      title: newQuestion,
      content: newQuestion,
      author: 'CurrentUser',
      username: 'current_user',
      profilePicture: '/images/current-user-avatar.png',
      likes: 0,
      comments: [],
      timestamp: 'Just now',
      category: 'general',
      isUserPost: true,
    };

    setQuestions([newQ, ...questions]);
    setNewQuestion('');
    if (callback) callback();
  };

  return { newQuestion, setNewQuestion, handleSubmitQuestion };
}