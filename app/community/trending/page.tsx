"use client";

import ProtectedRoute from "../../../components/shared/ProtectedRoute";

export default function TrendingPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold mb-4">Trending</h1>
        <p>This is the Trending page.</p>
      </div>
    </ProtectedRoute>
  );
}
