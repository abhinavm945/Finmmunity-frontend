"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useBreakpoint } from "../../hooks/useResponsive";

interface NewsCardProps {
  news: {
    id: number;
    title: string;
    description: string;
    shortDescription?: string;
    image?: string;
    author?: string;
    username?: string;
    views?: number;
    timestamp?: string;
    sources?: string[];
  };
}

export default function NewsCard({ news }: NewsCardProps) {
  const { responsiveClasses } = useBreakpoint();

  return (
    <Link href={`/news/${news.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200 hover:shadow-md transition-all h-full flex flex-col"
      >
        <h3
          className={`${responsiveClasses.text.mobile} sm:${responsiveClasses.text.tablet} font-semibold text-gray-800 mb-2 line-clamp-2`}
        >
          {news.title}
        </h3>

        <div className="flex flex-col space-y-2 flex-grow">
          {/* Sources Tags */}
          {news.sources && news.sources.length > 0 && (
            <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-1 sm:pb-2">
              {news.sources.slice(0, 3).map((source, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex-shrink-0"
                >
                  {source}
                </span>
              ))}
              {news.sources.length > 3 && (
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex-shrink-0">
                  +{news.sources.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Description */}
          <p
            className={`text-xs sm:text-sm text-gray-600 line-clamp-3 flex-grow`}
          >
            {news.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-2 sm:mt-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
          {news.views && (
            <span className="flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              {news.views}
            </span>
          )}
          {news.timestamp && (
            <span className="text-right">{news.timestamp}</span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
