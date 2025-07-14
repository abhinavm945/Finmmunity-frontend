// Environment Configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000',
  },

  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Finmunity',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  },

  // Feature Flags
  features: {
    socket: process.env.NEXT_PUBLIC_ENABLE_SOCKET !== 'false',
    notifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== 'false',
  },

  // Pagination
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 50,
  },

  // File Upload
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  },

  // Authentication
  auth: {
    tokenKey: 'token',
    refreshThreshold: 5 * 60 * 1000, // 5 minutes
  },

  // Development
  development: {
    useFallbackData: process.env.NODE_ENV === 'development',
    backendUrl: 'http://localhost:5000',
  },
};

// Development helpers
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// API endpoints
export const endpoints = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    profile: '/auth/profile',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  news: {
    all: '/news',
    trending: '/news/trending',
    categories: '/news/categories',
  },
  market: {
    stocks: '/market/stocks',
    overview: '/market/overview',
  },
  questions: {
    all: '/questions',
    user: '/questions/users',
  },
  community: {
    posts: '/community/posts',
    blogs: '/community/blogs',
    comments: '/community/comments',
    users: '/community/users',
  },
  user: {
    profile: '/users',
    posts: '/users/posts',
    blogs: '/users/blogs',
    followers: '/users/followers',
    following: '/users/following',
    bookmarks: '/users/bookmarks',
  },
  health: '/health',
}; 