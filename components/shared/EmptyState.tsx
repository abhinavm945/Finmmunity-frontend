"use client";

import {
  FileText,
  MessageSquare,
  Users,
  TrendingUp,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { getEmptyStateMessage } from "../../hooks/useData";

interface EmptyStateProps {
  type:
    | "posts"
    | "blogs"
    | "news"
    | "questions"
    | "myQuestions"
    | "suggestedUsers"
    | "stocks"
    | "error";
  onAction?: () => void;
  className?: string;
}

const getIcon = (type: string) => {
  switch (type) {
    case "posts":
      return <MessageSquare className="w-12 h-12 text-gray-400" />;
    case "blogs":
      return <FileText className="w-12 h-12 text-gray-400" />;
    case "news":
      return <TrendingUp className="w-12 h-12 text-gray-400" />;
    case "questions":
    case "myQuestions":
      return <HelpCircle className="w-12 h-12 text-gray-400" />;
    case "suggestedUsers":
      return <Users className="w-12 h-12 text-gray-400" />;
    case "error":
      return <RefreshCw className="w-12 h-12 text-gray-400" />;
    default:
      return <FileText className="w-12 h-12 text-gray-400" />;
  }
};

export default function EmptyState({
  type,
  onAction,
  className = "",
}: EmptyStateProps) {
  const { title, message, action } = getEmptyStateMessage(
    type,
    type === "error"
  );

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <div className="mb-4">{getIcon(type)}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {action}
        </button>
      )}
    </div>
  );
}
