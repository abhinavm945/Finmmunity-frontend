'use client';

import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import useQuestionForm from '../../hooks/ask/useQuestionForm';

interface QuestionFormProps {
  setQuestions: (questions: any[]) => void;
  questions: any[];
}

export default function QuestionForm({ setQuestions, questions }: QuestionFormProps) {
  const { newQuestion, setNewQuestion, handleSubmitQuestion } = useQuestionForm();

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'crypto', name: 'Crypto' },
    { id: 'stocks', name: 'Stocks' },
    { id: 'etfs', name: 'ETFs' },
    { id: 'economy', name: 'Economy' },
    { id: 'education', name: 'Education' },
    { id: 'strategies', name: 'Strategies' },
  ];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmitQuestion(questions, setQuestions);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Ask the Community</h2>
      <form onSubmit={onSubmit}>
        <div className="relative">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="What's your financial question?"
            className="w-full pl-4 pr-12 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full hover:shadow-lg transition-all"
          >
            <FiSend size={16} />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">Suggested: </span>
          {categories.slice(1, 5).map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200"
              onClick={() => setNewQuestion(`${newQuestion} ${cat.name} `)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}