"use client";

import ProtectedRoute from "../../../components/shared/ProtectedRoute";
import TrendingPage from "../../../components/community/TrendingPage";

export default function Trending() {
  return (
    <ProtectedRoute>
      <TrendingPage />
    </ProtectedRoute>
  );
}
