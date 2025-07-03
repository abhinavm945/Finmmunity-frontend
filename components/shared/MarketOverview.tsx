'use client';

import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import Link from 'next/link';

interface MarketData {
  id: string;
  name: string;
  value: string;
  change: string;
  isUp: boolean;
}

export default function MarketOverview() {
  const marketData: MarketData[] = [
    { id: 'nifty50', name: 'NIFTY 50', value: '22,510.23', change: '+1.2%', isUp: true },
    { id: 'sensex', name: 'SENSEX', value: '74,210.45', change: '+0.8%', isUp: true },
    { id: 'banknifty', name: 'BANK NIFTY', value: '48,500.67', change: '-0.5%', isUp: false },
    { id: 'niftymidcap', name: 'NIFTY MIDCAP', value: '45,850', change: '+1.0%', isUp: true },
    { id: 'niftysmallcap', name: 'NIFTY SMALLCAP', value: '15,650', change: '-0.3%', isUp: false },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Market Overview</h2>
        <Link href="/news/marketoverview">
          <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-md hover:shadow-lg transition-all text-sm hover:cursor-pointer">
            See All Stocks
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {marketData.map((item) => (
          <Link
            key={item.id}
            href={`/news/marketoverview/${item.id}`}
            className={`p-4 rounded-lg shadow-sm border transition-all hover:shadow-md ${
              item.isUp
                ? 'bg-gradient-to-br from-green-50 to-white'
                : 'bg-gradient-to-br from-red-50 to-white'
            }`}
          >
            <div className="text-sm font-medium text-gray-600">{item.name}</div>
            <div className="text-lg font-bold text-gray-800">{item.value}</div>
            <div className={`text-sm flex items-center ${item.isUp ? 'text-green-600' : 'text-red-600'}`}>
              {item.isUp ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
              <span>{item.change}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}