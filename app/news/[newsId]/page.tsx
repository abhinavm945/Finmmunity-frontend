"use client";

import { useState, useEffect } from "react";
import { Share2, ArrowLeft } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { api } from "../../../utils/api";
import { NewsItem } from "@/types/news";

export default function NewsDetail() {
  const searchParams = useSearchParams();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [activeTab, setActiveTab] = useState("Answer");
  const params = useParams();
  const router = useRouter();
  const newsId = params.newsId as string;
  const userId = searchParams.get("id");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.news.getNewsById(newsId);
        console.log("Fetched news by ID:", response);
        if (response.success && response.data) {
          setNews(response.data.news || response.data);
        } else {
          setNews(null);
        }
      } catch (err) {
        setNews(null);
        console.error("Error fetching news by ID:", err);
      }
    };
    if (newsId) fetchNews();
  }, [newsId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news?.title,
        text: news?.description,
        url: window.location.href,
      });
    } else {
      alert("Share feature not supported on this browser.");
    }
  };

  const handleBack = () => {
    if (userId) {
      router.push(`/?id=${userId}`);
    } else {
      router.back();
    }
  };

  if (!news) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <h3 className="text-lg font-medium text-gray-700">News not found</h3>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={handleBack}
          className="mb-4 flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm font-medium cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {news.title}
          </h1>
          <div className="flex space-x-4 mb-4">
            {["Answer", "Images", "Sources", "Steps"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-gray-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {activeTab === "Answer" && (
            <>
              {news.sources && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  {news.sources.map((source: string, index: number) => (
                    <a
                      key={index}
                      href={`https://${source}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 text-gray-700 text-sm px-1 py-10 rounded-lg flex items-center justify-center hover:bg-gray-200"
                    >
                      {source}
                    </a>
                  ))}
                </div>
              )}
              {news.images && news.images.length > 0 && (
                <div className="flex space-x-4 mb-4 overflow-x-auto pb-2">
                  {news.images.map((image: string, index: number) => (
                    <img
                      key={index}
                      className="h-40 w-58 object-cover rounded-lg flex-shrink-0"
                      src={image}
                      alt={`${news.title} image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
              <p className="text-gray-700 text-lg prose prose-sm max-w-none font-semibold">
                {news.description}
              </p>
            </>
          )}
          {activeTab === "Images" && news.images && news.images.length > 0 && (
            <div className="flex space-x-4 overflow-x-auto pb-2 mb-4">
              {news.images.map((image: string, index: number) => (
                <img
                  key={index}
                  className="h-50 w-68 object-cover rounded-lg flex-shrink-0"
                  src={image}
                  alt={`${news.title} image ${index + 1}`}
                />
              ))}
            </div>
          )}
          {activeTab === "Sources" && news.sources && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {news.sources.map((source: string, index: number) => (
                <a
                  key={index}
                  href={`https://${source}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 text-gray-700 text-sm px-3 py-10 rounded-lg flex items-center justify-center hover:bg-gray-200"
                >
                  {source}
                </a>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <span>{news.timestamp}</span>
            <div className="flex items-center gap-4">
              <span>{news.views} views</span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
