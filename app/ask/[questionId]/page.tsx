"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../utils/api";
import QuestionForm from "../../../components/ask/QuestionForm";

interface Question {
  id: string;
  title: string;
  body: string;
  // Add other fields as needed
}

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = params.questionId as string;

  const [question, setQuestion] = useState<Question | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likeLoading, setLikeLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  interface Comment {
    id: string;
    text: string;
    author: string;
    timestamp: string;
  }

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await api.questions.getQuestionById(questionId);
        console.log("Fetched question by ID:", response);
        if (response.success && response.data) {
          setQuestion(response.data as Question);
        } else {
          setQuestion(null);
        }
      } catch (err) {
        setQuestion(null);
        console.error("Error fetching question by ID:", err);
      }
    };
    if (questionId) fetchQuestion();
  }, [questionId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.questions.getQuestionComments(questionId);
        console.log("Fetched question comments:", response);
        if (response.success && response.data) {
          setComments(response.data as Comment[]);
        } else {
          setComments([]);
        }
      } catch (err) {
        setComments([]);
        console.error("Error fetching question comments:", err);
      }
    };
    if (questionId) fetchComments();
  }, [questionId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await api.questions.addComment(questionId, {
        text: newComment,
      });
      console.log("Add comment response:", response);
      if (response.success) {
        setNewComment("");
        // Refresh comments
        const commentsRes = await api.questions.getQuestionComments(questionId);
        setComments(commentsRes.data.comments || commentsRes.data);
      } else {
        setError(response.error?.message || "Failed to add comment.");
      }
    } catch (err: Error) {
      setError(err.message || "Failed to add comment.");
      console.error("Add comment error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Placeholder for like functionality (if backend supports it)
  const handleLike = async () => {
    setLikeLoading(true);
    try {
      // Example: await api.questions.likeQuestion(questionId);
      setLiked((prev) => !prev);
      // Optionally refetch question
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    setDeleteLoading(true);
    try {
      const response = await api.questions.deleteQuestion(questionId);
      console.log("Delete question response:", response);
      if (response.success) {
        router.push("/ask");
      } else {
        alert(response.error?.message || "Failed to delete question.");
      }
    } catch (err) {
      console.error("Delete question error:", err);
      alert("Failed to delete question.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 text-center">
        <h3 className="text-lg font-medium text-gray-700">
          Question not found
        </h3>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-500 hover:text-blue-600 text-sm font-medium"
      >
        ← Back
      </button>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {question.title}
        </h1>
        <p className="text-gray-700 mb-4">{question.body}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
          <span>Category: {question.title}</span>
          <span>By: {question.title}</span>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`px-3 py-1 rounded ${
              liked ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {liked ? "Liked" : "Like"}
          </button>
          {/* Show edit/delete for author or admin (for now, always show) */}
          <button
            onClick={() => setShowEditForm(true)}
            className="px-3 py-1 rounded bg-yellow-400 text-white hover:bg-yellow-500"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setShowEditForm(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
            <QuestionForm
              onClose={() => setShowEditForm(false)}
              questionToEdit={question}
            />
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>
        {comments.length > 0 ? (
          <ul className="space-y-4 mb-4">
            {comments.map((comment) => (
              <li key={comment.id} className="border-b pb-2">
                <div className="text-gray-800 text-sm">{comment.text}</div>
                <div className="text-xs text-gray-500 mt-1">
                  By: {comment.username || comment.author}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 mb-4">No comments yet.</div>
        )}
        <form onSubmit={handleAddComment} className="flex gap-2 mt-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      </div>
    </div>
  );
}
