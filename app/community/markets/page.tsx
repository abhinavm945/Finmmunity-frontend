"use client";

import ProtectedRoute from "../../../components/shared/ProtectedRoute";

export default function MarketsPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold mb-4">Markets</h1>
        <p>This is the Markets page.</p>
      </div>
    </ProtectedRoute>
  );
}
