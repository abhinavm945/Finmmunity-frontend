'use client';

import { useState, useEffect } from 'react';
import { Share2, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

interface News {
  id: number;
  title: string;
  description: string;
  image?: string;
  author: string;
  username: string;
  views: number;
  timestamp: string;
}

export default function NewsDetail() {
  const [news, setNews] = useState<News | null>(null);
  const params = useParams();
  const router = useRouter();
  const newsId = params.newsId as string;

  const demoNews: News[] = [
    {
      id: 1,
      title: 'Federal Reserve Signals Rate Cut in Q4',
      description: 'The Federal Reserve hinted at a potential rate cut in Q4 to stimulate economic growth amid slowing inflation. This move could significantly impact markets, with analysts predicting a boost in equity prices.',
      image: '/images/placeholder-news.jpg',
      author: 'EconWatch',
      username: 'econ_watch',
      views: 128,
      timestamp: '1 hour ago',
    },
    {
      id: 2,
      title: 'Tesla Stock Surges After Q3 Earnings',
      description: 'Tesla reported record profits, driven by strong electric vehicle demand and cost efficiencies, leading to a surge in stock prices. The company outperformed Wall Street expectations.',
      image: '/images/placeholder-news.jpg',
      author: 'TechInsider',
      username: 'tech_insider',
      views: 245,
      timestamp: '3 hours ago',
    },
    {
      id: 3,
      title: 'Crypto Market Sees Volatility Amid Regulatory Talks',
      description: 'Bitcoin and Ethereum prices fluctuated as global regulators discussed new crypto policies.',
      image: '/images/placeholder-news.jpg',
      author: 'CryptoNews',
      username: 'crypto_news',
      views: 180,
      timestamp: '5 hours ago',
    },
    {
      id: 4,
      title: 'NIFTY Bank Index Hits Record High',
      description: 'Strong performances by HDFC Bank and ICICI Bank drove the NIFTY Bank index to a new peak.',
      image: '/images/placeholder-news.jpg',
      author: 'MarketPulse',
      username: 'market_pulse',
      views: 300,
      timestamp: '2 hours ago',
    },
    {
      id: 5,
      title: 'ETFs Gain Popularity Among Retail Investors',
      description: 'Low-cost ETFs are attracting more retail investors seeking diversified portfolios.',
      image: '/images/placeholder-news.jpg',
      author: 'InvestSmart',
      username: 'invest_smart',
      views: 95,
      timestamp: '6 hours ago',
    },
    {
      id: 6,
      title: 'Tech Stocks Rally on AI Breakthroughs',
      description: 'Advancements in AI technology have sparked a rally in tech stocks, with companies like Nvidia leading the charge.',
      image: '/images/placeholder-news.jpg',
      author: 'TechTrend',
      username: 'tech_trend',
      views: 210,
      timestamp: '4 hours ago',
    },
    {
      id: 7,
      title: 'Gold Prices Surge Amid Economic Uncertainty',
      description: 'Investors are flocking to gold as a safe haven amid global economic concerns.',
      image: '/images/placeholder-news.jpg',
      author: 'MarketWatch',
      username: 'market_watch',
      views: 150,
      timestamp: '7 hours ago',
    },
    {
      id: 8,
      title: 'RBI Tightens Crypto Regulations',
      description: 'The Reserve Bank of India has introduced stricter regulations for cryptocurrency trading.',
      image: '/images/placeholder-news.jpg',
      author: 'FinanceToday',
      username: 'finance_today',
      views: 175,
      timestamp: '8 hours ago',
    },
  ];

  useEffect(() => {
    const newsItem = demoNews.find((item) => item.id === parseInt(newsId));
    setNews(newsItem || null);
  }, [newsId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news?.title,
        text: news?.description,
        url: window.location.href,
      });
    } else {
      alert('Share feature not supported on this browser.');
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!news) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 text-center">
        <h3 className="text-lg font-medium text-gray-700">News not found</h3>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button
        onClick={handleBack}
        className="mb-4 flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{news.title}</h1>
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <div>
            <span>By {news.author} (@{news.username})</span> • <span>{news.timestamp}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{news.views} views</span>
            <button onClick={handleShare} className="flex items-center gap-1 text-blue-500 hover:text-blue-600">
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
        {news.image && (
          <img
            className="w-full h-auto max-h-[400px] object-cover rounded-lg mb-4"
            src={news.image}
            alt={news.title}
          />
        )}
        <div
          className="text-gray-700 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: news.description }}
        />
      </div>
    </div>
  );
}