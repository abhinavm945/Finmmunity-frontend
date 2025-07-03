'use client';

import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Stock {
  id: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  category: string;
  value: string;
  change: string;
  isUp: boolean;
  isTrending: boolean;
}

export default function StockCard({ stock }: { stock: Stock }) {
  return (
    <Link href={`/news/marketoverview/${stock.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`p-4 rounded-lg shadow-sm border transition-all hover:shadow-md ${
          stock.isUp ? 'bg-gradient-to-br from-green-50 to-white' : 'bg-gradient-to-br from-red-50 to-white'
        }`}
      >
        <div className="text-base font-semibold text-gray-800 mb-2">{stock.name}</div>
        <div className="text-lg font-bold text-gray-800">{stock.value}</div>
        <div className={`text-sm flex items-center ${stock.isUp ? 'text-green-600' : 'text-red-600'} mb-2`}>
          {stock.isUp ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
          <span>{stock.change}</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full">{stock.exchange}</span>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{stock.category}</span>
          {stock.isTrending && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full">Trending</span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}