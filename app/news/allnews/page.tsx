'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import NewsCard from '../../../components/news/NewsCard';
import MarketOverview from '../../../components/shared/MarketOverview';
import useNewsFilter from '../../../hooks/news/useNewsFilter';
import { useRouter } from 'next/navigation';

export default function AllNews() {
  const { activeCategory, setActiveCategory } = useNewsFilter('all');
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const demoNews = [
    {
      id: 1,
      title: 'Federal Reserve Signals Rate Cut in Q4',
      shortDescription: 'Fed hints at Q4 rate cut to boost economy.',
      image: '/images/placeholder-news.jpg',
      views: 128,
      timestamp: '1 hour ago',
      category: 'economy',
    },
    {
      id: 2,
      title: 'Tesla Stock Surges After Q3 Earnings',
      shortDescription: 'Tesla shares soar post Q3 earnings.',
      image: '/images/placeholder-news.jpg',
      views: 245,
      timestamp: '3 hours ago',
      category: 'stocks',
    },
    {
      id: 3,
      title: 'Crypto Market Sees Volatility Amid Regulatory Talks',
      shortDescription: 'Crypto prices swing due to regulatory talks.',
      image: '/images/placeholder-news.jpg',
      views: 180,
      timestamp: '5 hours ago',
      category: 'crypto',
    },
    {
      id: 4,
      title: 'NIFTY Bank Index Hits Record High',
      shortDescription: 'NIFTY Bank index reaches all-time high.',
      image: '/images/placeholder-news.jpg',
      views: 300,
      timestamp: '2 hours ago',
      category: 'stocks',
    },
    {
      id: 5,
      title: 'ETFs Gain Popularity Among Retail Investors',
      shortDescription: 'ETFs see surge in retail investor interest.',
      image: '/images/placeholder-news.jpg',
      views: 95,
      timestamp: '6 hours ago',
      category: 'etfs',
    },
    {
      id: 6,
      title: 'Tech Stocks Rally on AI Breakthroughs',
      shortDescription: 'Tech stocks rally on AI advancements.',
      image: '/images/placeholder-news.jpg',
      views: 210,
      timestamp: '4 hours ago',
      category: 'stocks',
    },
    {
      id: 7,
      title: 'Gold Prices Surge Amid Economic Uncertainty',
      shortDescription: 'Gold prices rise amid uncertainty.',
      image: '/images/placeholder-news.jpg',
      views: 150,
      timestamp: '7 hours ago',
      category: 'economy',
    },
    {
      id: 8,
      title: 'RBI Tightens Crypto Regulations',
      shortDescription: 'RBI imposes stricter crypto rules.',
      image: '/images/placeholder-news.jpg',
      views: 175,
      timestamp: '8 hours ago',
      category: 'crypto',
    },
  ];

  useEffect(() => {
    setNewsItems(demoNews);
  }, []);

  const filteredNews = newsItems.filter(
    (item) =>
      (activeCategory === 'all' || item.category === activeCategory) &&
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'crypto', name: 'Crypto' },
    { id: 'stocks', name: 'Stocks' },
    { id: 'etfs', name: 'ETFs' },
    { id: 'economy', name: 'Economy' },
  ];

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <MarketOverview />
      <button
        onClick={handleBack}
        className="mb-4 flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">All News</h2>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search news..."
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
        {filteredNews.length > 0 ? (
          filteredNews.map((news) => <NewsCard key={news.id} news={news} />)
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700">No news found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or category.</p>
          </div>
        )}
      </div>
    </div>
  );
}