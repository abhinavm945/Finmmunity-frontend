'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface NewsCardProps {
  news: {
    id: number;
    title: string;
    shortDescription: string;
    views: number;
    timestamp: string;
  };
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <Link href={`/news/${news.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-all"
      >
        <h3 className="text-base font-semibold text-gray-800 mb-2">{news.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{news.shortDescription}</p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{news.views} views</span>
          <span>{news.timestamp}</span>
        </div>
      </motion.div>
    </Link>
  );
}