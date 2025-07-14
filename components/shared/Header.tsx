"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  FaNewspaper,
  FaUser,
  FaRegCommentDots,
  FaSearch,
  FaChevronDown,
} from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { Switch } from "@headlessui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { clearAllState } from "../../redux/store";
import { api } from "../../utils/api";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function Header() {
  const [isCrypto, setIsCrypto] = useState(false);
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const router = useRouter();
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getActiveTab = () => {
    if (pathname.startsWith("/community")) return "COMMUNITY";
    if (pathname.startsWith("/ask")) return "ASK";
    return "NEWZ";
  };
  const activeTab = getActiveTab();

  const tabs = [
    {
      label: "NEWZ",
      icon: <FaNewspaper size={25} />,
      path: userId ? `/?id=${userId}` : "/",
    },
    {
      label: "COMMUNITY",
      icon: <FaUser size={25} />,
      path: userId ? `/community?id=${userId}` : "/community",
    },
    {
      label: "ASK",
      icon: <FaRegCommentDots size={25} />,
      path: userId ? `/ask?id=${userId}` : "/ask",
    },
  ];

  const categories = [
    "All Categories",
    "Market News",
    "Company Updates",
    "Economic Reports",
    "Crypto News",
    "Investment Tips",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setShowCategories(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get username from Redux (or user context)
  const username: string | undefined = useSelector(
    (state: RootState) => state.user.user?.username
  );
  const profilePicture: string | undefined = useSelector(
    (state: RootState) => state.user.user?.profilePicture
  );

  // Handle click outside desktop dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target as Node)
      ) {
        setDesktopDropdownOpen(false);
      }
    }
    if (desktopDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [desktopDropdownOpen]);

  // Handle click outside mobile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target as Node)
      ) {
        setMobileDropdownOpen(false);
      }
    }
    if (mobileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileDropdownOpen]);

  const getBreadcrumb = () => {
    switch (activeTab) {
      case "NEWZ":
        return "News Feed";
      case "COMMUNITY":
        return "User Community";
      case "ASK":
        return "Ask Community";
      default:
        return "Home";
    }
  };

  const handleLogout = () => {
    clearAllState();
    api.client.reset();
    console.log("User logged out");
    router.push("/login");
  };

  return (
    <>
      {/* Top Header Section (Scrollable) */}
      <div className="bg-white relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold italic bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pr-2"
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
                    showCategories ? "transform rotate-180" : ""
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
          <div className="flex md:hidden items-center flex-grow mx-1">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center w-full border border-gray-300 rounded-full px-2 py-1 shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 relative"
              ref={categoriesRef}
            >
              <button
                className="text-gray-400 mr-1"
                onClick={() => setShowCategories(!showCategories)}
                aria-label="Filter categories"
              >
                <IoFilter size={14} />
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
                className="flex-grow outline-none placeholder-gray-400 text-xs"
              />
              <FaSearch className="text-gray-400 ml-1" size={12} />
            </motion.div>
          </div>

          {/* Desktop Login/Signup */}
          <div className="hidden md:flex items-center space-x-4">
            {!isClient ? null : username ? (
              <div className="relative" ref={desktopDropdownRef}>
                <button
                  onClick={() => setDesktopDropdownOpen((open) => !open)}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm cursor-pointer shadow-md hover:shadow-lg transition-all"
                  title={`Logged in as ${username}`}
                  type="button"
                >
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    username.charAt(0).toUpperCase()
                  )}
                </button>
                {desktopDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg py-2 z-50 border border-gray-200">
                    <button
                      onClick={() => {
                        setDesktopDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      type="button"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Mobile Login/Signup or UserId */}
          <div className="flex md:hidden items-center space-x-1">
            {!isClient ? null : username ? (
              <div className="relative" ref={mobileDropdownRef}>
                <button
                  onClick={() => setMobileDropdownOpen((open) => !open)}
                  className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs cursor-pointer shadow-md hover:shadow-lg transition-all"
                  title={`Logged in as ${username}`}
                  type="button"
                >
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Avatar"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    username.charAt(0).toUpperCase()
                  )}
                </button>
                {mobileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg py-2 z-50 border border-gray-200">
                    <button
                      onClick={() => {
                        setMobileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      type="button"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-2 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <Link href="/login">Login</Link>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Tabs and Breadcrumbs (Sticky) */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
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
              <span className="font-medium text-blue-600">
                {getBreadcrumb()}
              </span>
            </div>

            {activeTab === "NEWZ" && (
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isCrypto}
                  onChange={setIsCrypto}
                  className={`${
                    isCrypto ? "bg-purple-600" : "bg-blue-600"
                  } relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200`}
                >
                  <span
                    className={`${
                      isCrypto ? "translate-x-4" : "translate-x-0.5"
                    } inline-block h-3.5 w-3.5 transform bg-white rounded-full transition-transform duration-200`}
                  />
                </Switch>
                <span className="text-sm md:text-lg italic font-semibold text-gray-700">
                  {isCrypto ? "CRYPTO" : "STOCKS"}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-8 md:space-x-14 py-2">
            {tabs.map((tab) => (
              <motion.div
                key={tab.label}
                onHoverStart={() => setIsHovering(tab.label)}
                onHoverEnd={() => setIsHovering(null)}
                className={`flex flex-col items-center cursor-pointer ${
                  activeTab === tab.label
                    ? "text-blue-600 font-bold"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors duration-200 ${
                  !userId && (tab.label === "COMMUNITY" || tab.label === "ASK")
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <Link href={tab.path}>
                  <div className="flex items-center space-x-2 text-lg md:text-xl">
                    <motion.span
                      animate={{
                        rotate: isHovering === tab.label ? [0, 10, -10, 0] : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {tab.icon}
                    </motion.span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </div>
                  <motion.div
                    className={`h-1 w-10 mt-1 ${
                      activeTab === tab.label ? "bg-blue-600" : "bg-transparent"
                    } rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: activeTab === tab.label ? 40 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
                {!userId &&
                  (tab.label === "COMMUNITY" || tab.label === "ASK") && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
