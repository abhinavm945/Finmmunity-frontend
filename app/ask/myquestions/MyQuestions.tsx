"use client";

import { useState, useEffect } from "react";
import { Search, ArrowLeft } from "lucide-react";
import QuestionCard from "../../../components/ask/QuestionCard";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "../../../components/shared/ProtectedRoute";
import { useQuestions } from "../../../hooks/useApi";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";

export default function MyQuestions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const urlCategory = searchParams.get("category");
  const urlSearch = searchParams.get("search");

  const [activeCategory, setActiveCategory] = useState(urlCategory || "all");
  const [searchQuery, setSearchQuery] = useState(urlSearch || "");
  const { questions } = useQuestions();

  // Load user's questions
  useEffect(() => {
    questions.getMyQuestions.execute();
  }, [questions.getMyQuestions]);

  const userQuestions = questions.getMyQuestions.data || [];

  const filteredQuestions = userQuestions
    .filter((q) => activeCategory === "all" || q.category === activeCategory)
    .filter((q) => q.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Map API data to QuestionCard shape
  const mappedQuestions = filteredQuestions.map((q) => {
    return {
      id: typeof q.id === "string" ? parseInt(q.id, 10) : q.id,
      title: q.title,
      content: q.content,
      author: q.user?.username || "User",
      username: q.user?.username || "user",
      profilePicture: q.user?.profilePicture || "/images/default-avatar.png",
      likes: Array.isArray(q.likes) ? q.likes.length : 0,
      comments: Array.isArray(q.comments)
        ? q.comments.map(
            (c: {
              id: string | number;
              user?: { username?: string };
              text?: string;
              content?: string;
            }) => ({
              id: typeof c.id === "string" ? parseInt(c.id, 10) : c.id,
              author: c.user?.username || "User",
              text: c.text || c.content || "",
            })
          )
        : [],
      timestamp: q.createdAt || "",
      category: q.category || "general",
    };
  });

  const categories = [
    { id: "all", name: "All Questions" },
    { id: "crypto", name: "Crypto" },
    { id: "stocks", name: "Stocks" },
    { id: "etfs", name: "ETFs" },
    { id: "economy", name: "Economy" },
    { id: "education", name: "Education" },
    { id: "strategies", name: "Strategies" },
  ];

  const handleBack = () => {
    const params = new URLSearchParams();
    if (userId) params.set("id", userId);
    const backURL = params.toString() ? `/ask?${params.toString()}` : "/ask";
    router.push(backURL);
  };

  // Update URL parameters when state changes
  const updateURLParams = (newCategory?: string, newSearch?: string) => {
    const params = new URLSearchParams();
    if (userId) params.set("id", userId);
    if (newCategory && newCategory !== "all")
      params.set("category", newCategory);
    if (newSearch) params.set("search", newSearch);

    const newURL = params.toString()
      ? `/ask/myquestions?${params.toString()}`
      : "/ask/myquestions";
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

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-4 flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          My Questions
        </h2>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search my questions..."
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
          {questions.getMyQuestions.loading ? (
            <div className="col-span-full flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : mappedQuestions.length > 0 ? (
            mappedQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700">
                No questions found
              </h3>
              <p className="mt-2 text-gray-500">
                You haven&apos;t posted any questions yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
