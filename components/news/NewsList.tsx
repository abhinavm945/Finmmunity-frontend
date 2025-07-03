'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import NewsCard from './NewsCard';
import MarketOverview from '../shared/MarketOverview';
import useNewsFilter from '../../hooks/news/useNewsFilter';
import Link from 'next/link';

export default function NewsList() {
  const { activeCategory, setActiveCategory } = useNewsFilter('all');
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const demoNews = [
    {
      id: 1,
      title: 'Federal Reserve Signals Rate Cut in Q4',
      description: 'The Fed hinted at a potential rate cut to stimulate economic growth amid slowing inflation. This move could impact markets significantly.',
      shortDescription: 'Fed hints at Q4 rate cut to boost economy.',
      image: '/images/placeholder-news.jpg',
      author: 'EconWatch',
      username: 'econ_watch',
      views: 128,
      timestamp: '1 hour ago',
      category: 'economy',
    },
    {
      id: 2,
      title: 'Tesla Stock Surges After Q3 Earnings',
      description: 'Tesla reported record profits, driven by strong EV demand and cost efficiencies, leading to a surge in stock prices.',
      shortDescription: 'Tesla shares soar post Q3 earnings.',
      image: '/images/placeholder-news.jpg',
      author: 'TechInsider',
      username: 'tech_insider',
      views: 245,
      timestamp: '3 hours ago',
      category: 'stocks',
    },
    {
      id: 3,
      title: 'Crypto Market Sees Volatility Amid Regulatory Talks',
      description: 'Bitcoin and Ethereum prices fluctuated as global regulators discussed new crypto policies.',
      shortDescription: 'Crypto prices swing due to regulatory talks.',
      image: '/images/placeholder-news.jpg',
      author: 'CryptoNews',
      username: 'crypto_news',
      views: 180,
      timestamp: '5 hours ago',
      category: 'crypto',
    },
    {
      id: 4,
      title: 'NIFTY Bank Index Hits Record High',
      description: 'Strong performances by HDFC Bank and ICICI Bank drove the NIFTY Bank index to a new peak.',
      shortDescription: 'NIFTY Bank index reaches all-time high.',
      image: '/images/placeholder-news.jpg',
      author: 'MarketPulse',
      username: 'market_pulse',
      views: 300,
      timestamp: '2 hours ago',
      category: 'stocks',
    },
    {
      id: 5,
      title: 'ETFs Gain Popularity Among Retail Investors',
      description: 'Low-cost ETFs are attracting more retail investors seeking diversified portfolios.',
      shortDescription: 'ETFs see surge in retail investor interest.',
      image: '/images/placeholder-news.jpg',
      author: 'InvestSmart',
      username: 'invest_smart',
      views: 95,
      timestamp: '6 hours ago',
      category: 'etfs',
    },
    {
      id: 6,
      title: 'Tech Stocks Rally on AI Breakthroughs',
      description: 'Advancements in AI technology have sparked a rally in tech stocks, with companies like Nvidia leading the charge.',
      shortDescription: 'Tech stocks rally on AI advancements.',
      image: '/images/placeholder-news.jpg',
      author: 'TechTrend',
      username: 'tech_trend',
      views: 210,
      timestamp: '4 hours ago',
      category: 'stocks',
    },
    {
      id: 7,
      title: 'Gold Prices Surge Amid Economic Uncertainty',
      description: 'Investors are flocking to gold as a safe haven amid global economic concerns.',
      shortDescription: 'Gold prices rise amid uncertainty.',
      image: '/images/placeholder-news.jpg',
      author: 'MarketWatch',
      username: 'market_watch',
      views: 150,
      timestamp: '7 hours ago',
      category: 'economy',
    },
    {
      id: 8,
      title: 'RBI Tightens Crypto Regulations',
      description: 'The Reserve Bank of India has introduced stricter regulations for cryptocurrency trading.',
      shortDescription: 'RBI imposes stricter crypto rules.',
      image: '/images/placeholder-news.jpg',
      author: 'FinanceToday',
      username: 'finance_today',
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

  const trendingNews = [...demoNews]
    .sort((a, b) => b.views - a.views)
    .slice(0, 7);

  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'crypto', name: 'Crypto' },
    { id: 'stocks', name: 'Stocks' },
    { id: 'etfs', name: 'ETFs' },
    { id: 'economy', name: 'Economy' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <MarketOverview />
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Trending News</h2>
          <Link href="/news/trending">
            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-md hover:shadow-lg transition-all text-sm hover:cursor-pointer">
              See All Trending News
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm "
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
      {filteredNews.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Link href="/news/allnews">
            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-md hover:shadow-lg transition-all text-md hover:cursor-pointer">
              See All News
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}