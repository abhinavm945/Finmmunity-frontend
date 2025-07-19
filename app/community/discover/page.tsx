"use client";

import ProtectedRoute from "../../../components/shared/ProtectedRoute";
import DiscoverUserList from "../../../components/community/DiscoverUserList";

export default function DiscoverPage() {
  return (
    <ProtectedRoute>
      <div className="py-8">
        <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
          Discover People
        </h1>
        <DiscoverUserList />
      </div>
    </ProtectedRoute>
  );
}
