'use client';

import { useState, useRef, useEffect } from 'react';
import { FaNewspaper, FaUser, FaRegCommentDots, FaSearch, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import { IoFilter } from 'react-icons/io5';
import { Switch } from '@headlessui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isCrypto, setIsCrypto] = useState(false);
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.startsWith('/community')) return 'COMMUNITY';
    if (pathname.startsWith('/ask')) return 'ASK';
    return 'NEWZ';
  };
  const activeTab = getActiveTab();

  const tabs = [
    { label: 'NEWZ', icon: <FaNewspaper size={25} />, path: '/' },
    { label: 'COMMUNITY', icon: <FaUser size={25} />, path: '/community' },
    { label: 'ASK', icon: <FaRegCommentDots size={25} />, path: '/ask' },
  ];

  const categories = [
    'All Categories',
    'Market News',
    'Company Updates',
    'Economic Reports',
    'Crypto News',
    'Investment Tips',
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setShowCategories(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'NEWZ':
        return 'News Feed';
      case 'COMMUNITY':
        return 'User Community';
      case 'ASK':
        return 'Ask Community';
      default:
        return 'Home';
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Top Header Section (Scrollable) */}
      <div className="bg-white relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl sm:text-3xl font-extrabold italic bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pr-2"
          >
            <Link href="/">FINMUNITY</Link>
          </motion.div>

          {/* Desktop Search Bar with Categories */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="hidden md:flex items-center w-full max-w-2xl border border-gray-300 rounded-full px-4 py-2 mx-4 sm:mx-6 shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 relative"
            ref={categoriesRef}
          >
            <div className="relative">
              <button
                className="flex items-center outline-none text-gray-500 mr-4 pr-6 bg-transparent cursor-pointer"
                onClick={() => setShowCategories(!showCategories)}
              >
                Categories
                <FaChevronDown
                  className={`ml-1 text-gray-400 text-xs transition-transform ${
                    showCategories ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {showCategories && (
                <div className="absolute z-50 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => setShowCategories(false)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="h-5 border-r border-gray-300 mr-4"></div>
            <input
              type="text"
              placeholder="Search for news..."
              className="flex-grow outline-none placeholder-gray-400 text-sm"
            />
            <FaSearch className="text-gray-400 ml-2" />
          </motion.div>

          {/* Mobile Search Bar with Filter Icon */}
          <div className="flex md:hidden items-center flex-grow mx-2">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center w-full border border-gray-300 rounded-full px-3 py-1.5 shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 relative"
              ref={categoriesRef}
            >
              <button
                className="text-gray-400 mr-2"
                onClick={() => setShowCategories(!showCategories)}
                aria-label="Filter categories"
              >
                <IoFilter size={18} />
              </button>
              {showCategories && (
                <div className="absolute z-50 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 top-full left-0">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => setShowCategories(false)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
              <input
                type="text"
                placeholder="Search..."
                className="flex-grow outline-none placeholder-gray-400 text-sm"
              />
              <FaSearch className="text-gray-400 ml-2" />
            </motion.div>
          </div>

          {/* Desktop Login/Signup */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Link href="/login">Log in</Link>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <Link href="/signup">Sign up</Link>
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-500 hover:text-blue-600 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-lg border-t border-gray-200"
        >
          <div className="px-4 py-4 max-w-7xl mx-auto">
            {/* Navigation Tabs */}
            <div className="flex flex-col space-y-4">
              {tabs.map((tab) => (
                <Link
                  key={tab.label}
                  href={tab.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex justify-center items-center space-x-2 text-lg ${
                    activeTab === tab.label
                      ? 'text-blue-600 font-bold'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </Link>
              ))}
            </div>

            {/* Crypto/Stocks Switch (only on NEWZ page) */}
            {activeTab === 'NEWZ' && (
              <div className="mt-4 flex items-center space-x-2">
                <Switch
                  checked={isCrypto}
                  onChange={setIsCrypto}
                  className={`${
                    isCrypto ? 'bg-purple-600' : 'bg-blue-600'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200`}
                >
                  <span
                    className={`${
                      isCrypto ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform bg-white rounded-full transition-transform duration-200`}
                  />
                </Switch>
                <span className="text-sm font-semibold text-gray-700">
                  {isCrypto ? 'CRYPTO' : 'STOCKS'}
                </span>
              </div>
            )}

            {/* Mobile Login/Signup */}
            <div className="mt-4 flex flex-col space-y-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all text-center"
                >
                  Log in
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all text-center"
                >
                  Sign up
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Desktop Tabs and Breadcrumbs (Sticky) */}
      <div className="hidden md:block sticky top-0 z-20 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center py-2">
            <div className="text-sm text-gray-500">
              <Link
                href="/"
                className="hover:text-blue-600 cursor-pointer transition-colors"
              >
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="font-medium text-blue-600">{getBreadcrumb()}</span>
            </div>

            {activeTab === 'NEWZ' && (
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isCrypto}
                  onChange={setIsCrypto}
                  className={`${
                    isCrypto ? 'bg-purple-600' : 'bg-blue-600'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200`}
                >
                  <span
                    className={`${
                      isCrypto ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform bg-white rounded-full transition-transform duration-200`}
                  />
                </Switch>
                <span className="text-lg italic font-semibold text-gray-700">
                  {isCrypto ? 'CRYPTO' : 'STOCKS'}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-14 py-2">
            {tabs.map((tab) => (
              <motion.div
                key={tab.label}
                onHoverStart={() => setIsHovering(tab.label)}
                onHoverEnd={() => setIsHovering(null)}
                className={`flex flex-col items-center cursor-pointer ${
                  activeTab === tab.label
                    ? 'text-blue-600 font-bold'
                    : 'text-gray-500 hover:text-gray-700'
                } transition-colors duration-200`}
              >
                <Link href={tab.path}>
                  <div className="flex items-center space-x-2 text-xl">
                    <motion.span
                      animate={{
                        rotate: isHovering === tab.label ? [0, 10, -10, 0] : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {tab.icon}
                    </motion.span>
                    <span>{tab.label}</span>
                  </div>
                  <motion.div
                    className={`h-1 w-10 mt-1 ${
                      activeTab === tab.label ? 'bg-blue-600' : 'bg-transparent'
                    } rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: activeTab === tab.label ? 40 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}