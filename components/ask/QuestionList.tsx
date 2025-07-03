'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import QuestionCard from './QuestionCard';
import QuestionForm from './QuestionForm';
import Link from 'next/link';

export default function QuestionList() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const demoQuestions = [
    {
      id: 1,
      title: "What's the best strategy for investing in crypto during a bear market?",
      content: 'I’ve been holding through this bear market but wondering if there are specific strategies to minimize losses and maximize gains when the market turns bullish.',
      author: 'CryptoEnthusiast',
      username: 'crypto_enthusiast',
      profilePicture: '/images/avatar1.png',
      likes: 42,
      comments: [
        { id: 1, author: 'TraderZ', text: 'Dollar-cost averaging is key!' },
      ],
      timestamp: '2 hours ago',
      category: 'crypto',
    },
    {
      id: 2,
      title: 'Should I diversify my ETF portfolio?',
      content: 'I currently hold a single ETF, but I’m considering adding more to spread risk. What are the pros and cons of diversifying an ETF portfolio?',
      author: 'InvestorPro',
      username: 'investor_pro',
      profilePicture: '/images/avatar2.png',
      likes: 30,
      comments: [
        { id: 1, author: 'FinanceFan', text: 'Diversification is always a good idea!' },
      ],
      timestamp: '5 hours ago',
      category: 'etfs',
    },
    {
      id: 3,
      title: 'How does inflation affect stock market returns?',
      content: 'With inflation rising, I’m worried about my stock investments. Can someone explain how inflation impacts stock returns and what sectors might perform better?',
      author: 'MarketWatcher',
      username: 'market_watcher',
      profilePicture: '/images/avatar3.png',
      likes: 25,
      comments: [],
      timestamp: '1 day ago',
      category: 'economy',
    },
    {
      id: 4,
      title: 'What are the best technical indicators for day trading?',
      content: 'I’m new to day trading and want to know which technical indicators are most reliable for short-term stock trading.',
      author: 'TraderX',
      username: 'trader_x',
      profilePicture: '/images/avatar4.png',
      likes: 15,
      comments: [
        { id: 1, author: 'StockGuru', text: 'RSI and MACD are great starters!' },
      ],
      timestamp: '3 hours ago',
      category: 'strategies',
    },
    {
      id: 5,
      title: 'Is it worth investing in small-cap stocks?',
      content: 'I’ve heard small-cap stocks can offer high returns but come with higher risks. What should I consider before investing in them?',
      author: 'RiskTaker',
      username: 'risk_taker',
      profilePicture: '/images/avatar5.png',
      likes: 20,
      comments: [],
      timestamp: '6 hours ago',
      category: 'stocks',
      isUserPost: true, // Indicates this is posted by the current user
    },
  ];

  useEffect(() => {
    setQuestions(demoQuestions);
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <QuestionForm setQuestions={setQuestions} questions={questions} />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
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
            <p className="mt-2 text-gray-500">
              Be the first to ask a question about{' '}
              {categories.find((c) => c.id === activeCategory)?.name || 'this topic'}
            </p>
          </div>
        )}
      </div>
      {filteredQuestions.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Link href="/ask/myquestions">
            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-md hover:shadow-lg transition-all text-md">
              See My Questions
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}