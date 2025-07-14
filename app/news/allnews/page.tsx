"use client";

import { useState, useEffect } from "react";
import { Search, ArrowLeft, Edit, Trash2, Plus } from "lucide-react";
import NewsCard from "../../../components/news/NewsCard";
import MarketOverview from "../../../components/shared/MarketOverview";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../../../utils/api";
import { NewsItem } from "../../../types/news";
import { Category } from "../../../types/category";

export default function AllNews() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlCategory = searchParams.get("category");
  const urlSearch = searchParams.get("search");

  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState(urlSearch || "");
  const [activeCategory, setActiveCategory] = useState(urlCategory || "all");
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState<NewsItem>({
    title: "",
    description: "",
    shortDescription: "",
    image: "",
    author: "",
    category: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchNews = async () => {
    try {
      const params: Record<string, string> = {};
      if (activeCategory && activeCategory !== "all")
        params.category = activeCategory;
      if (searchQuery) params.search = searchQuery;
      const response = await api.news.getAllNews(params);
      console.log("Fetched news:", response);
      if (response.success && response.data) {
        setNewsItems(response.data.data || response.data);
      } else {
        setNewsItems([]);
      }
    } catch (err) {
      setNewsItems([]);
      console.error("Error fetching news:", err);
    }
  };

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleBack = () => {
    router.back();
  };

  const openCreateForm = () => {
    setFormMode("create");
    setFormData({
      title: "",
      description: "",
      shortDescription: "",
      image: "",
      author: "",
      category: "",
    });
    setEditId(null);
    setShowForm(true);
  };

  const openEditForm = (news: NewsItem) => {
    setFormMode("edit");
    setFormData({
      title: news.title || "",
      description: news.description || "",
      shortDescription: news.shortDescription || "",
      image: news.image || "",
      author: news.author || "",
      category: news.category || "",
    });
    setEditId(news.id);
    setShowForm(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formMode === "create") {
        const response = await api.news.createNews(formData);
        console.log("Create news response:", response);
      } else if (formMode === "edit" && editId) {
        const response = await api.news.updateNews(editId, formData);
        console.log("Update news response:", response);
      }
      setShowForm(false);
      fetchNews();
    } catch (err) {
      console.error("Error submitting news form:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news item?")) return;
    setLoading(true);
    try {
      const response = await api.news.deleteNews(id);
      console.log("Delete news response:", response);
      fetchNews();
    } catch (err) {
      console.error("Error deleting news:", err);
    } finally {
      setLoading(false);
    }
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          All News (Admin)
        </h2>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <Plus size={16} /> Create News
        </button>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search news..."
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
        {newsItems.length > 0 ? (
          newsItems.map((news) => (
            <div key={news.id} className="relative group">
              <NewsCard news={news} />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditForm(news)}
                  className="p-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(news.id)}
                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700">No news found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search or category.
            </p>
          </div>
        )}
      </div>
      {/* Admin News Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4">
              {formMode === "create" ? "Create News" : "Edit News"}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={formData.title}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Short Description
                </label>
                <input
                  name="shortDescription"
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={formData.shortDescription}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  name="image"
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={formData.image}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Author
                </label>
                <input
                  name="author"
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={formData.author}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={formData.category}
                  onChange={handleFormChange}
                >
                  <option value="">Select category</option>
                  {categories
                    .filter((cat) => cat.id !== "all")
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading
                  ? formMode === "create"
                    ? "Creating..."
                    : "Saving..."
                  : formMode === "create"
                  ? "Create"
                  : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
