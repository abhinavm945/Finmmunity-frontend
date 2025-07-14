"use client";

import ProtectedRoute from "../../../components/shared/ProtectedRoute";

export default function DiscoverPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold mb-4">Discover</h1>
        <p>This is the Discover page.</p>
      </div>
    </ProtectedRoute>
  );
}
