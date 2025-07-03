'use client';

import NewsList from '../components/news/NewsList';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NewsList />
    </div>
  );
}