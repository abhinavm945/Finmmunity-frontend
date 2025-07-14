"use client";

import ProtectedRoute from "../../../components/shared/ProtectedRoute";

export default function SavedPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold mb-4">Saved</h1>
        <p>This is the Saved page.</p>
      </div>
    </ProtectedRoute>
  );
}
