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
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    hover: { 
      scale: 1.03, 
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  return (
    <Link href={`/news/marketoverview/${stock.id}`}>
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        className={`p-5 rounded-xl border border-gray-100 shadow-md transition-all duration-300 ${
          stock.isUp
            ? 'bg-gradient-to-br from-green-100/50 to-white'
            : 'bg-gradient-to-br from-red-100/50 to-white'
        }`}
      >
        <div className="text-base font-semibold text-gray-900 tracking-tight mb-2">{stock.name}</div>
        <div className="text-2xl font-extrabold text-gray-900">{stock.value}</div>
        <div className={`text-sm font-medium flex items-center mt-1.5 ${
          stock.isUp ? 'text-green-600' : 'text-red-600'
        } mb-3`}>
          {stock.isUp ? (
            <FiTrendingUp className="mr-1.5 h-5 w-5" />
          ) : (
            <FiTrendingDown className="mr-1.5 h-5 w-5" />
          )}
          <span>{stock.change}</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <span className="px-2.5 py-1 bg-blue-100/80 text-blue-700 rounded-full">{stock.exchange}</span>
          <span className="px-2.5 py-1 bg-gray-100/80 text-gray-700 rounded-full">{stock.category}</span>
          {stock.isTrending && (
            <span className="px-2.5 py-1 bg-yellow-100/80 text-yellow-700 rounded-full flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Trending
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}