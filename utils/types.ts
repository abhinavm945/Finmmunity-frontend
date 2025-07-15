// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  followers: string[];
  following: string[];
  createdAt: string;
  updatedAt: string;
}

// Post Types
export interface Post {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  content: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  isBookmarked?: boolean;
}

// Blog Types
export interface Blog {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  title: string;
  content: string;
  image?: string;
  gifUrl?: string;
  tags: string[];
  category: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  isBookmarked?: boolean;
}

// Comment Types
export interface Comment {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  content: string;
  postId?: string;
  blogId?: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

// Question Types
export interface Question {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  title: string;
  content: string;
  category: string;
  likes: string[];
  comments: QuestionComment[];
  isAnswered: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// Question Comment Types
export interface QuestionComment {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  text: string;
  isAnswer: boolean;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

// News Types
export interface News {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  category: string;
  author: string;
  source: string;
  url: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Market Types
export interface Stock {
  id: string;
  name: string;
  symbol: string;
  exchange: 'NSE' | 'BSE';
  category: string;
  value: string;
  change: string;
  changePercent: string;
  isUp: boolean;
  isTrending: boolean;
  lastUpdated: string;
}

export interface MarketOverview {
  totalStocks: number;
  gainers: number;
  losers: number;
  unchanged: number;
  topGainers: Stock[];
  topLosers: Stock[];
  trendingStocks: Stock[];
  lastUpdated: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION';
  content: string;
  userId: string;
  targetId: string;
  createdAt: string;
  read: boolean;
}

// Message Types
export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  read: boolean;
}

// Conversation Types
export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// Bookmark Types
export interface Bookmark {
  id: string;
  userId: string;
  type: 'POST' | 'BLOG';
  postId?: string;
  blogId?: string;
  post?: Post;
  blog?: Blog;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    details: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

export interface PostForm {
  content: string;
  image?: File;
}

export interface BlogForm {
  title: string;
  content: string;
  tags: string;
  category: string;
  image?: File;
}

export interface CommentForm {
  content: string;
  postId?: string;
  blogId?: string;
}

export interface QuestionForm {
  title: string;
  content: string;
  category: string;
}

export interface QuestionCommentForm {
  text: string;
  isAnswer?: boolean;
}

// Filter Types
export interface NewsFilter {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface QuestionFilter {
  category?: string;
  search?: string;
  filter?: 'all' | 'investment' | 'crypto' | 'stocks' | 'trading';
  sort?: 'latest' | 'popular' | 'unanswered';
  page?: number;
  limit?: number;
}

export interface CommunityFilter {
  search?: string;
  page?: number;
  limit?: number;
} 