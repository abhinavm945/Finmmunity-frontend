"use client";

import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";
import { useBreakpoint } from "../../hooks/useResponsive";

interface MarketData {
  id: string;
  name: string;
  value: string;
  change: string;
  isUp: boolean;
}

export default function MarketOverview() {
  const { responsiveClasses } = useBreakpoint();

  const marketData: MarketData[] = [
    {
      id: "nifty50",
      name: "NIFTY 50",
      value: "22,510.23",
      change: "+1.2%",
      isUp: true,
    },
    {
      id: "sensex",
      name: "SENSEX",
      value: "74,210.45",
      change: "+0.8%",
      isUp: true,
    },
    {
      id: "banknifty",
      name: "BANK NIFTY",
      value: "48,500.67",
      change: "-0.5%",
      isUp: false,
    },
    {
      id: "niftymidcap",
      name: "NIFTY MIDCAP",
      value: "45,850",
      change: "+1.0%",
      isUp: true,
    },
    {
      id: "niftysmallcap",
      name: "NIFTY SMALLCAP",
      value: "15,650",
      change: "-0.3%",
      isUp: false,
    },
  ];

  const cardVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    initial: {
      scale: 1,
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      boxShadow: "0 4px 14px rgba(59, 130, 246, 0.3)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <div
      className={`bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <h2
          className={`${responsiveClasses.text.mobile} sm:${responsiveClasses.text.tablet} lg:${responsiveClasses.text.desktop} font-bold text-gray-900 tracking-tight`}
        >
          Market Overview
        </h2>
        <Link href="/news/marketoverview">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium text-xs sm:text-sm shadow-md hover:shadow-xl transition-all duration-300 whitespace-nowrap"
          >
            See All Stocks
          </motion.button>
        </Link>
      </div>

      <div
        className={`grid ${responsiveClasses.grid.mobile} sm:${responsiveClasses.grid.tablet} md:grid-cols-3 lg:${responsiveClasses.grid.desktop} gap-3 sm:gap-4`}
      >
        {marketData.map((item) => (
          <Link key={item.id} href={`/news/marketoverview/${item.id}`}>
            <motion.div
              className={`p-3 sm:p-4 lg:p-5 rounded-xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 ${
                item.isUp
                  ? "bg-gradient-to-br from-green-100/50 to-white"
                  : "bg-gradient-to-br from-red-100/50 to-white"
              }`}
              variants={cardVariants}
              initial="initial"
              whileHover="hover"
            >
              <div className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                {item.name}
              </div>
              <div
                className={`${responsiveClasses.text.mobile} sm:${responsiveClasses.text.tablet} lg:${responsiveClasses.text.desktop} font-extrabold text-gray-900 mt-1`}
              >
                {item.value}
              </div>
              <div
                className={`text-xs sm:text-sm font-medium flex items-center mt-2 ${
                  item.isUp ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.isUp ? (
                  <FiTrendingUp className="mr-1 sm:mr-1.5 h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <FiTrendingDown className="mr-1 sm:mr-1.5 h-4 w-4 sm:h-5 sm:w-5" />
                )}
                <span>{item.change}</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
