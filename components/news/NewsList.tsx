"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Search, Filter } from "lucide-react";
import NewsCard from "./NewsCard";
import MarketOverview from "../shared/MarketOverview";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews, clearNews } from "../../redux/newsSlice";
import { api } from "../../utils/api";
import { NewsItem } from "../../types/news";
import { Category } from "../../types/category";

export default function NewsList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("id");
  const urlCategory = searchParams.get("category");
  const urlSearch = searchParams.get("search");
  const urlPage = searchParams.get("page");

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState(urlSearch || "");
  const [activeCategory, setActiveCategory] = useState(urlCategory || "all");
  const [currentPage, setCurrentPage] = useState(parseInt(urlPage || "1"));
  const itemsPerPage = 10;
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(
    urlSearch || ""
  );

  const dispatch = useDispatch();
  const { news = [], loading, error } = useSelector((state) => state.news);

  // Use a ref to track if we've already fetched data for the current params
  const lastFetchParams = useRef<string>("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Memoize the params to prevent unnecessary API calls
  const requestParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page: currentPage,
      limit: itemsPerPage,
    };
    if (activeCategory && activeCategory !== "all")
      params.category = activeCategory;
    if (debouncedSearchQuery) params.search = debouncedSearchQuery;
    return params;
  }, [currentPage, activeCategory, debouncedSearchQuery, itemsPerPage]);

  // Create a string key for the current params to check if we need to fetch
  const paramsKey = useMemo(
    () => JSON.stringify(requestParams),
    [requestParams]
  );

  // Memoize the fetch function to prevent recreation on every render
  const fetchNewsData = useCallback(() => {
    // Only fetch if params have changed or if we don't have data
    if (paramsKey !== lastFetchParams.current || news.length === 0) {
      lastFetchParams.current = paramsKey;
      dispatch(fetchNews(requestParams));
    }
  }, [dispatch, requestParams, paramsKey, news.length]);

  useEffect(() => {
    fetchNewsData();
  }, [fetchNewsData]);

  // Cleanup effect to clear news data when component unmounts
  useEffect(() => {
    return () => {
      // Only clear if we're not on a page that needs the news data
      const currentPath = window.location.pathname;
      if (currentPath !== "/" && currentPath !== "/news") {
        dispatch(clearNews());
      }
      // Clear any pending requests for this component
      api.client.clearRequestQueue();
    };
  }, [dispatch]);

  // Keep the categories fetching logic as is (if you want to use Redux for categories, add a thunk)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // You can use Redux for this if you want
        const response = await import("../../utils/api").then((m) =>
          m.api.news.getCategories()
        );
        if (response.success && Array.isArray(response.data)) {
          setCategories([
            { id: "all", name: "All News" },
            ...response.data.map((cat: string) => ({
              id: cat,
              name: cat.charAt(0).toUpperCase() + cat.slice(1),
            })),
          ]);
        } else {
          setCategories([{ id: "all", name: "All News" }]);
        }
      } catch (error) {
        setCategories([{ id: "all", name: "All News" }]);
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Update URL parameters when state changes
  const updateURLParams = useCallback(
    (newCategory?: string, newSearch?: string, newPage?: number) => {
      const params = new URLSearchParams();
      if (userId) params.set("id", userId);
      if (newCategory && newCategory !== "all")
        params.set("category", newCategory);
      if (newSearch) params.set("search", newSearch);
      if (newPage && newPage > 1) params.set("page", newPage.toString());

      const newURL = params.toString() ? `/?${params.toString()}` : "/";
      router.push(newURL);
    },
    [userId, router]
  );

  // Handle search query changes
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      setCurrentPage(1);
    },
    []
  );

  // Update URL when debounced search changes
  useEffect(() => {
    updateURLParams(activeCategory, debouncedSearchQuery, currentPage);
  }, [debouncedSearchQuery, activeCategory, currentPage, updateURLParams]);

  // Handle category changes
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setActiveCategory(value);
      setCurrentPage(1);
      updateURLParams(value, debouncedSearchQuery, 1);
    },
    [debouncedSearchQuery, updateURLParams]
  );

  // Calculate totalPages if your API provides it in Redux, otherwise keep as is

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
        News
      </h2>
      {/* Market Overview */}
      <MarketOverview />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Latest News
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Stay updated with the latest financial news and market insights from
            trusted sources
          </p>
        </div>
        <Link href="/news/trending">
          <button className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-md hover:shadow-lg transition-all text-sm sm:text-base">
            <span className="hidden sm:inline">Trending News</span>
            <span className="sm:hidden">Trending</span>
          </button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" size={20} />
          <select
            value={activeCategory}
            onChange={handleCategoryChange}
            className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* News List */}
      <div className="space-y-4 sm:space-y-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : news.length > 0 ? (
          news.map((newsItem: NewsItem) => (
            <NewsCard key={newsItem.id} news={newsItem} />
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
              No news found
            </h3>
            <p className="text-gray-500 text-sm sm:text-base mb-4">
              Try adjusting your search or filter criteria.
            </p>
            <Link href="/news/allnews">
              <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-md hover:shadow-lg transition-all text-sm sm:text-base">
                Browse All News
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {/* totalPages is not directly available in the Redux state, so we'll keep the original logic */}
      {/* If your API provides totalPages, you would set it here */}
      {/* For now, we'll assume a placeholder or calculate it if available */}
      {/* Example: const totalPages = Math.ceil(news.length / itemsPerPage); */}
      {/* This part of the logic needs to be adjusted based on how totalPages is obtained */}
      {/* For now, we'll keep the original structure but acknowledge the missing totalPages */}
      {/* If your API provides totalPages, uncomment and set the value */}
      {/* {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-2 rounded-lg border border-gray-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 sm:px-4 py-2 rounded-lg border border-gray-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}
