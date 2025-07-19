import { config } from './config';

// API Base Configuration
const API_BASE_URL = config.api.baseUrl;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
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

// Fallback data for when backend is not available
const fallbackData = {
  news: [
    {
      id: '1',
      title: 'Federal Reserve Signals Rate Cut in Q4',
      shortDescription: 'Fed hints at Q4 rate cut to boost economy.',
      content: 'The Federal Reserve has indicated a potential rate cut in the fourth quarter to stimulate economic growth...',
      image: '/images/placeholder-news.jpg',
      views: 128,
      timestamp: '1 hour ago',
      category: 'economy',
      author: 'Financial Times',
      publishedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Tesla Stock Surges After Q3 Earnings',
      shortDescription: 'Tesla shares soar post Q3 earnings.',
      content: 'Tesla stock experienced a significant surge following the release of their third-quarter earnings report...',
      image: '/images/placeholder-news.jpg',
      views: 245,
      timestamp: '3 hours ago',
      category: 'stocks',
      author: 'Market Watch',
      publishedAt: new Date().toISOString(),
    },
  ],
  stocks: [
    {
      id: 'nifty50',
      name: 'NIFTY 50',
      exchange: 'NSE',
      category: 'Index',
      value: '22,510.23',
      change: '+1.2%',
      isUp: true,
      isTrending: true,
      previousClose: '22,250.00',
      volume: '2.5B',
      marketCap: '15.2T',
    },
    {
      id: 'sensex',
      name: 'SENSEX',
      exchange: 'BSE',
      category: 'Index',
      value: '74,210.45',
      change: '+0.8%',
      isUp: true,
      isTrending: false,
      previousClose: '73,650.00',
      volume: '1.8B',
      marketCap: '12.8T',
    },
  ],
  questions: [
    {
      id: '1',
      title: 'What are the best investment strategies for beginners?',
      content: 'I\'m new to investing and would like to know what strategies work best for beginners. Any advice?',
      category: 'education',
      likes: 15,
      comments: [],
      timestamp: '2 hours ago',
      user: {
        id: 'user1',
        username: 'investor_new',
        profilePicture: '/images/default-avatar.png',
      },
      isAnswered: false,
      createdAt: new Date().toISOString(),
    },
  ],
  auth: {
    login: {
      success: true,
      data: {
        user: {
          id: 'demo-user-1',
          username: 'demo_user',
          email: 'demo@finmunity.com',
          profilePicture: '/images/default-avatar.png',
          bio: 'Demo user for testing',
          followers: [],
          following: [],
          createdAt: new Date().toISOString(),
        },
        token: 'demo-jwt-token-12345',
      },
      message: 'Login successful',
    },
    register: {
      success: true,
      message: 'Registration successful',
    },
    currentUser: {
      success: true,
      data: {
        id: 'demo-user-1',
        username: 'demo_user',
        email: 'demo@finmunity.com',
        profilePicture: '/images/default-avatar.png',
        bio: 'Demo user for testing',
        followers: [],
        following: [],
        createdAt: new Date().toISOString(),
      },
    },
  },
};

// Helper function to get fallback data
function getFallbackData(endpoint: string): any {
  if (endpoint.includes('/news')) {
    return { success: true, data: fallbackData.news };
  }
  if (endpoint.includes('/market/stocks')) {
    return { success: true, data: fallbackData.stocks };
  }
  if (endpoint.includes('/questions')) {
    return { success: true, data: fallbackData.questions };
  }
  if (endpoint.includes('/auth/login')) {
    return fallbackData.auth.login;
  }
  if (endpoint.includes('/auth/register')) {
    return fallbackData.auth.register;
  }
  if (endpoint.includes('/auth/me')) {
    return fallbackData.auth.currentUser;
  }
  return { success: true, data: [] };
}

// Helper function to normalize API response
function normalizeResponse(data: any): ApiResponse<any> {
  if (data && typeof data.success === 'boolean') {
    // If the response has no 'data' property, put everything except 'success', 'message', and 'error' into 'data'
    if (data.data !== undefined) {
      return data;
    } else {
      const { success, message, error, ...rest } = data;
      return {
        success,
        message,
        error,
        data: Object.keys(rest).length > 0 ? rest : undefined,
      };
    }
  }
  
  // If response has error property, convert to standard format
  if (data && data.error) {
    return {
      success: false,
      error: {
        code: data.error.code || 'UNKNOWN_ERROR',
        message: data.error.message || 'An unknown error occurred',
        details: data.error.details || data.error.message,
      },
    };
  }
  
  // If response has data property, it's a success response
  if (data && data.data !== undefined) {
    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  }
  
  // Default success response
  return {
    success: true,
    data,
  };
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private requestQueue: Map<string, Promise<any>> = new Map();
  private lastRequestTime: Map<string, number> = new Map();
  private readonly MIN_REQUEST_INTERVAL = 50; // 50ms minimum between requests to same endpoint

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  // Set authentication token
  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // Get authentication headers
  private getHeaders(contentType: string = 'application/json'): HeadersInit {
    const headers: HeadersInit = {};
    
    if (contentType === 'application/json') {
      headers['Content-Type'] = 'application/json';
    }
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Check if request requires authentication but user is not authenticated
    const requiresAuth = !endpoint.includes('/auth/') && 
                        !endpoint.includes('/news') && 
                        !endpoint.includes('/market') &&
                        !endpoint.includes('/questions') &&
                        !endpoint.includes('/community');
    
    if (requiresAuth && !this.token) {
      console.warn('Request requires authentication but no token found:', url);
      throw new Error('Authentication required');
    }
    
    // Create a unique key for this request including method and body
    const requestKey = this.createRequestKey(url, options);
    
    // Check if we have a pending request for this exact request
    if (this.requestQueue.has(requestKey)) {
      console.log('Request already in progress for:', requestKey);
      return this.requestQueue.get(requestKey)!;
    }

    // Check rate limiting
    const now = Date.now();
    const lastRequest = this.lastRequestTime.get(url) || 0;
    const timeSinceLastRequest = now - lastRequest;

    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      const waitTime = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${waitTime}ms before next request to ${url}`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    // Create the request promise
    const requestPromise = this.makeRequest<T>(url, options);
    this.requestQueue.set(requestKey, requestPromise);
    this.lastRequestTime.set(url, Date.now());

    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.requestQueue.delete(requestKey);
    }
  }

  private createRequestKey(url: string, options: RequestInit): string {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    // Debug logging for development (reduced verbosity)
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_API === 'true') {
      console.log('API Request:', {
        url,
        method: config.method,
        body: config.body
      });
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Debug logging for development (reduced verbosity)
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_API === 'true') {
        console.log('API Response:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
      }

      if (!response.ok) {
        // Handle rate limiting
        if (response.status === 429) {
          console.warn('Rate limit exceeded. Please wait before making more requests.');
          console.warn('Response headers:', Object.fromEntries(response.headers.entries()));
          throw new Error('Too many requests, please try again later');
        }

        // Handle authentication errors
        if (response.status === 401 || response.status === 403) {
          console.warn('Authentication error:', response.status, response.statusText);
          this.setToken(null);
          // Clear token from localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          // Don't redirect for auth endpoints to avoid loops
          if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
          throw new Error('Invalid or expired token');
        }
        
        // For 400 errors, include the response data to help debug
        if (response.status === 400) {
          console.error('400 Bad Request - Response data:', data);
          const normalizedError = normalizeResponse(data);
          throw new Error(normalizedError.error?.message || `Bad Request: ${JSON.stringify(data)}`);
        }

        // For 404 errors, use fallback data in development
        if (response.status === 404) {
          console.warn('404 Not Found - Endpoint not found:', url);
          if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            console.warn('🔧 Development Mode: Using fallback data due to 404 error for', url);
            const fallback = getFallbackData(url);
            console.log('Fallback data returned:', fallback);
            return fallback;
          }
          throw new Error('Endpoint not found');
        }

        // For 500 errors, provide helpful debugging information
        if (response.status === 500) {
          console.error('500 Internal Server Error - Response data:', data);
          console.error('This usually means there\'s an issue with the backend server. Check the backend logs.');
          
          // In development, use fallback data for 500 errors
          if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            console.warn('🔧 Development Mode: Using fallback data due to 500 error for', url);
            const fallback = getFallbackData(url);
            console.log('Fallback data returned:', fallback);
            return fallback;
          }
          
          const normalizedError = normalizeResponse(data);
          throw new Error(normalizedError.error?.message || 'Internal Server Error - Backend server encountered an error');
        }
        
        const normalizedError = normalizeResponse(data);
        throw new Error(normalizedError.error?.message || `HTTP error! status: ${response.status}`);
      }

      // Normalize the response to ensure consistent structure
      return normalizeResponse(data);
    } catch (error: any) {
      console.error('API request failed:', error);
      console.error('Request URL:', url);
      console.error('Request config:', config);
      
      // Handle network errors (backend not available)
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        console.warn('Backend server not available. Using fallback data.');
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          console.log('🔧 Development Mode: Using fallback data for', url);
        }
        return getFallbackData(url);
      }
      
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Clear request queue and reset state
  clearRequestQueue() {
    this.requestQueue.clear();
    this.lastRequestTime.clear();
  }

  // Reset API client state completely
  reset() {
    this.token = null;
    this.requestQueue.clear();
    this.lastRequestTime.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // File upload request
  async upload<T>(endpoint: string, formData: FormData, method: 'POST' | 'PUT' = 'POST'): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      method,
      headers: {
        'Authorization': this.token ? `Bearer ${this.token}` : '',
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null);
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        const normalizedError = normalizeResponse(data);
        throw new Error(normalizedError.error?.message || `HTTP error! status: ${response.status}`);
      }

      return normalizeResponse(data);
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Authentication API
export const authAPI = {
  // Register user
  register: async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    return apiClient.post('/auth/register', userData);
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post<{ token: string; user: any }>('/auth/login', credentials);
    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
    }
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    return apiClient.get('/auth/me');
  },

  // Update profile
  updateProfile: async (formData: FormData) => {
    return apiClient.upload('/auth/profile', formData, 'PUT');
  },

  // Refresh token
  refreshToken: async () => {
    const response = await apiClient.post<{ token: string }>('/auth/refresh');
    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
    }
    return response;
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token: string, password: string) => {
    return apiClient.post('/auth/reset-password', { token, password });
  },

  // Logout
  logout: () => {
    apiClient.setToken(null);
  },
};

// News API
export const newsAPI = {
  // Get all news
  getAllNews: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) => {
    return apiClient.get<PaginatedResponse<any>>('/news', params);
  },

  // Get news by ID
  getNewsById: async (id: string) => {
    return apiClient.get(`/news/${id}`);
  },

  // Get trending news
  getTrendingNews: async () => {
    return apiClient.get('/news/trending');
  },

  // Get news categories
  getCategories: async () => {
    return apiClient.get('/news/categories');
  },

  // Get market stocks
  getMarketStocks: async () => {
    return apiClient.get('/market/stocks');
  },

  // Get market overview
  getMarketOverview: async () => {
    return apiClient.get('/market/overview');
  },
};

// Questions API
export const questionsAPI = {
  // Get all questions
  getAllQuestions: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) => {
    return apiClient.get<PaginatedResponse<any>>('/questions', params);
  },

  // Get question by ID
  getQuestionById: async (id: string) => {
    return apiClient.get(`/questions/${id}`);
  },

  // Create question
  createQuestion: async (questionData: {
    title: string;
    content: string;
    category: string;
  }) => {
    return apiClient.post('/questions', questionData);
  },

  // Update question
  updateQuestion: async (id: string, questionData: {
    title?: string;
    content?: string;
    category?: string;
  }) => {
    return apiClient.put(`/questions/${id}`, questionData);
  },

  // Delete question
  deleteQuestion: async (id: string) => {
    return apiClient.delete(`/questions/${id}`);
  },

  // Get question comments
  getQuestionComments: async (id: string) => {
    return apiClient.get(`/questions/${id}/comments`);
  },

  // Add comment to question
  addComment: async (id: string, commentData: { text: string }) => {
    return apiClient.post(`/questions/${id}/comments`, commentData);
  },

  // Get user questions
  getUserQuestions: async (userId: string) => {
    return apiClient.get(`/questions/users/${userId}`);
  },
};

// Community API
export const communityAPI = {
  // Posts
  posts: {
    // Create post
    create: async (formData: FormData) => {
      return apiClient.upload('/community/posts', formData);
    },

    // Get all posts
    getAll: async (params?: { page?: number; limit?: number }) => {
      return apiClient.get<PaginatedResponse<any>>('/community/posts', params);
    },

    // Get post by ID
    getById: async (id: string) => {
      return apiClient.get(`/community/posts/${id}`);
    },

    // Update post
    update: async (id: string, formData: FormData) => {
      return apiClient.upload(`/community/posts/${id}`, formData);
    },

    // Delete post
    delete: async (id: string) => {
      return apiClient.delete(`/community/posts/${id}`);
    },

    // Like/Unlike post
    toggleLike: async (id: string) => {
      return apiClient.post(`/community/posts/${id}/like`);
    },

    // Bookmark/Unbookmark post
    toggleBookmark: async (id: string) => {
      return apiClient.post(`/community/posts/${id}/bookmark`);
    },
  },

  // Blogs
  blogs: {
    // Create blog
    create: async (formData: FormData) => {
      return apiClient.upload('/community/blogs', formData);
    },

    // Get all blogs
    getAll: async (params?: {
      page?: number;
      limit?: number;
      category?: string;
      search?: string;
    }) => {
      return apiClient.get<PaginatedResponse<any>>('/community/blogs', params);
    },

    // Get blog by ID
    getById: async (id: string) => {
      return apiClient.get(`/community/blogs/${id}`);
    },

    // Update blog
    update: async (id: string, formData: FormData) => {
      return apiClient.upload(`/community/blogs/${id}`, formData);
    },

    // Delete blog
    delete: async (id: string) => {
      return apiClient.delete(`/community/blogs/${id}`);
    },

    // Like/Unlike blog
    toggleLike: async (id: string) => {
      return apiClient.post(`/community/blogs/${id}/like`);
    },

    // Bookmark/Unbookmark blog
    toggleBookmark: async (id: string) => {
      return apiClient.post(`/community/blogs/${id}/bookmark`);
    },
  },

  // Comments
  comments: {
    // Add comment
    add: async (commentData: {
      content: string;
      postId?: string;
      blogId?: string;
    }) => {
      return apiClient.post('/community/comments', commentData);
    },

    // Update comment
    update: async (id: string, commentData: { content: string }) => {
      return apiClient.put(`/community/comments/${id}`, commentData);
    },

    // Delete comment
    delete: async (id: string) => {
      return apiClient.delete(`/community/comments/${id}`);
    },

    // Like/Unlike comment
    toggleLike: async (id: string) => {
      return apiClient.post(`/community/comments/${id}/like`);
    },
  },

  // User interactions
  users: {
    // Follow/Unfollow user
    toggleFollow: async (userId: string) => {
      return apiClient.post(`/community/users/${userId}/follow`);
    },

    // Get suggested users
    getSuggested: async (params?: { page?: number; limit?: number }) => {
      return apiClient.get<PaginatedResponse<any>>('/community/users/suggested', params);
    },

    // Get user bookmarks
    getBookmarks: async (params?: {
      page?: number;
      limit?: number;
      type?: 'POST' | 'BLOG';
    }) => {
      return apiClient.get<PaginatedResponse<any>>('/community/users/bookmarks', params);
    },
  },

  // Messages
  messages: {
    // Get conversations
    getConversations: async () => {
      return apiClient.get('/messages/conversations');
    },

    // Get messages for a conversation
    getConversationMessages: async (conversationId: string, page = 1, limit = 50) => {
      return apiClient.get(`/messages/conversations/${conversationId}/messages`, { page, limit });
    },

    // Get the last message in a conversation
    getLastMessage: async (conversationId: string) => {
      return apiClient.get(`/messages/conversations/${conversationId}/last-message`);
    },

    // Send message in a conversation
    sendMessage: async (conversationId: string, content: string) => {
      return apiClient.post(`/messages/conversations/${conversationId}/messages`, { content });
    },

    // Start a new conversation
    startConversation: async (receiverId: string, content: string) => {
      return apiClient.post('/messages/conversations', { receiverId, content });
    },

    // Get unread message count
    getUnreadCount: async () => {
      return apiClient.get('/messages/unread-count');
    },

    // Mark a message as read
    markMessageRead: async (messageId: string) => {
      return apiClient.put(`/messages/${messageId}/read`);
    },
  },

  // Notifications
  notifications: {
    // Get all notifications
    getAll: async (params?: { page?: number; limit?: number }) => {
      return apiClient.get<PaginatedResponse<any>>('/community/notifications', params);
    },

    // Mark notification as read
    markAsRead: async (params: { id: string }) => {
      return apiClient.put('/community/notifications/read', params);
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
      return apiClient.put('/community/notifications/read-all');
    },
  },
};

// User API
export const userAPI = {
  // Get user profile
  getProfile: async (userId: string) => {
    return apiClient.get(`/users/${userId}`);
  },

  // Get user posts
  getPosts: async (userId: string) => {
    return apiClient.get(`/users/${userId}/posts`);
  },

  // Get user blogs
  getBlogs: async (userId: string) => {
    return apiClient.get(`/users/${userId}/blogs`);
  },

  // Get user followers
  getFollowers: async (userId: string) => {
    return apiClient.get(`/users/${userId}/followers`);
  },

  // Get user following
  getFollowing: async (userId: string) => {
    return apiClient.get(`/users/${userId}/following`);
  },

  // Get user bookmarks
  getBookmarks: async (userId: string) => {
    return apiClient.get(`/users/${userId}/bookmarks`);
  },

  // Search users by username or email
  searchUsers: async (query: string) => {
    return apiClient.get(`/users/search`, { query });
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    return apiClient.get('/health');
  },
};

// Chat API
export const chatAPI = {
  markMessageDelivered: async (id: string) => {
    return apiClient.put(`/messages/${id}/delivered`);
  },
  markMessageRead: async (id: string) => {
    return apiClient.put(`/messages/${id}/read`);
  },
};

// Export all APIs
export const api = {
  auth: authAPI,
  news: newsAPI,
  questions: questionsAPI,
  community: communityAPI,
  user: userAPI,
  health: healthAPI,
  client: apiClient,
}; 