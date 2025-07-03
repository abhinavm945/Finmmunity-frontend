'use client';

import { useState } from 'react';

export default function useNewsFilter(initialCategory: string = 'all') {
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  return { activeCategory, setActiveCategory };
}