'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import QuestionCard from '../../../components/ask/QuestionCard';
import { useRouter } from 'next/navigation';

export default function MyQuestions() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const demoQuestions = [
    {
      id: 5,
      title: 'Is it worth investing in small-cap stocks?',
      content: 'I’ve heard small-cap stocks can offer high returns but come with higher risks. What should I consider before investing in them?',
      author: 'CurrentUser',
      username: 'current_user',
      profilePicture: '/images/current-user-avatar.png',
      likes: 20,
      comments: [],
      timestamp: '6 hours ago',
      category: 'stocks',
      isUserPost: true,
    },
  ];

  useEffect(() => {
    setQuestions(demoQuestions.filter((q) => q.isUserPost));
  }, []);

  const filteredQuestions = questions
    .filter((q) => activeCategory === 'all' || q.category === activeCategory)
    .filter((q) => q.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'crypto', name: 'Crypto' },
    { id: 'stocks', name: 'Stocks' },
    { id: 'etfs', name: 'ETFs' },
    { id: 'economy', name: 'Economy' },
    { id: 'education', name: 'Education' },
    { id: 'strategies', name: 'Strategies' },
  ];

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <button
        onClick={handleBack}
        className="mb-4 flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">My Questions</h2>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search my questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700">No questions found</h3>
            <p className="mt-2 text-gray-500">You haven't posted any questions yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}