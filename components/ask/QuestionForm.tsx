"use client";

import { useState, useEffect } from "react";
import { api } from "../../utils/api";

interface QuestionFormProps {
  onClose: () => void;
  questionToEdit?: Question; // If present, form is in edit mode
}

export default function QuestionForm({
  onClose,
  questionToEdit,
}: QuestionFormProps) {
  const [title, setTitle] = useState(questionToEdit?.title || "");
  const [content, setContent] = useState(questionToEdit?.body || "");
  const [category, setCategory] = useState(
    questionToEdit?.category || "investment"
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.questions.getCategories();
        if (response.success && response.data) {
          setCategories(response.data as Category[]);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const questionData = {
        title,
        body: content,
        category,
      };

      let response;
      if (questionToEdit) {
        response = await api.questions.updateQuestion(
          questionToEdit.id,
          questionData
        );
      } else {
        response = await api.questions.createQuestion(questionData);
      }

      if (response.success) {
        onClose();
      } else {
        setError(response.error?.message || "Failed to save question.");
      }
    } catch (error) {
      setError((error as Error).message || "Failed to save question.");
      console.error("Error saving question:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat: Category) => (
            <option key={cat.id} value={cat.name}>
              {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
            </option>
          ))}
        </select>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? questionToEdit
              ? "Saving..."
              : "Posting..."
            : questionToEdit
            ? "Save Changes"
            : "Post Question"}
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
