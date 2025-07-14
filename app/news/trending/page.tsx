"use client";

import { useState, useEffect } from "react";
import { Search, ArrowLeft } from "lucide-react";
import NewsCard from "../../../components/news/NewsCard";
import MarketOverview from "../../../components/shared/MarketOverview";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../../../utils/api";
import { NewsItem } from "../../../types/news";
import { Category } from "../../../types/category";

export default function TrendingNews() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("id");
  const urlCategory = searchParams.get("category");
  const urlSearch = searchParams.get("search");

  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState(urlSearch || "");
  const [activeCategory, setActiveCategory] = useState(urlCategory || "all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = {};
        if (activeCategory && activeCategory !== "all")
          params.category = activeCategory;
        if (searchQuery) params.search = searchQuery;
        const response = await api.news.getTrendingNews(params);
        console.log("Fetched trending news:", response);
        if (response.success && response.data) {
          setNewsItems(response.data.data || response.data);
        } else {
          setNewsItems([]);
        }
      } catch (error) {
        setNewsItems([]);
        console.error("Error fetching trending news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingNews();
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.news.getCategories();
        console.log("Fetched categories:", response);
        if (response.success && response.data) {
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
      } catch (err) {
        setCategories([{ id: "all", name: "All News" }]);
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Update URL parameters when state changes
  const updateURLParams = (newCategory?: string, newSearch?: string) => {
    const params = new URLSearchParams();
    if (userId) params.set("id", userId);
    if (newCategory && newCategory !== "all")
      params.set("category", newCategory);
    if (newSearch) params.set("search", newSearch);

    const newURL = params.toString()
      ? `/news/trending?${params.toString()}`
      : "/news/trending";
    router.push(newURL);
  };

  // Handle search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    updateURLParams(activeCategory, value);
  };

  // Handle category changes
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    updateURLParams(categoryId, searchQuery);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <MarketOverview />
      <button
        onClick={handleBack}
        className="mb-4 flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Trending News
      </h2>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search trending news..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeCategory === category.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
            <p className="text-gray-500">Loading trending news...</p>
          </div>
        ) : newsItems.length > 0 ? (
          newsItems.map((news) => <NewsCard key={news.id} news={news} />)
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700">
              No trending news
            </h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search or category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
