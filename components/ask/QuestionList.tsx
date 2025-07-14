"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Plus } from "lucide-react";
import QuestionCard from "./QuestionCard";
import QuestionForm from "./QuestionForm";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestions } from "../../redux/askSlice";

export default function QuestionList() {
  const searchParams = useSearchParams();
  const urlFilter = searchParams.get("filter");
  const urlSearch = searchParams.get("search");
  const urlPage = searchParams.get("page");

  const [searchQuery, setSearchQuery] = useState(urlSearch || "");
  const [activeFilter, setActiveFilter] = useState(urlFilter || "all");
  const [currentPage, setCurrentPage] = useState(parseInt(urlPage || "1"));
  const [showForm, setShowForm] = useState(false);
  const itemsPerPage = 10;

  const dispatch = useDispatch();
  const { questions = [], loading, error } = useSelector((state) => state.ask);

  useEffect(() => {
    const params: Record<string, string | number> = {
      page: currentPage,
      limit: itemsPerPage,
    };
    if (activeFilter && activeFilter !== "all") params.filter = activeFilter;
    if (searchQuery) params.search = searchQuery;
    dispatch(fetchQuestions(params));
  }, [dispatch, activeFilter, searchQuery, currentPage, itemsPerPage]);

  // Handle search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setActiveFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Ask Community
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Get answers from financial experts and community members
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Ask Question</span>
          <span className="sm:hidden">Ask</span>
        </button>
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
            placeholder="Search questions..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" size={20} />
          <select
            value={activeFilter}
            onChange={handleFilterChange}
            className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base"
          >
            <option value="all">All Questions</option>
            <option value="recent">Recent</option>
            <option value="popular">Popular</option>
            <option value="unanswered">Unanswered</option>
          </select>
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-4 sm:space-y-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
              No questions found
            </h3>
            <p className="text-gray-500 text-sm sm:text-base mb-4">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Question Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
            <QuestionForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
