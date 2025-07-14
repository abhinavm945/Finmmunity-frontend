import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { apiClient } from '../utils/api';
import { 
  Post, 
  Blog, 
  Comment, 
  User, 
  News, 
  Question, 
  QuestionComment,
  Stock,
  MarketOverview,
  Notification,
  Message,
  Conversation,
  Bookmark,
  PostForm,
  BlogForm,
  CommentForm,
  QuestionForm,
  QuestionCommentForm,
  NewsFilter,
  QuestionFilter,
  CommunityFilter
} from '../utils/types';

// Generic API hook creator with state management
function createApiHook<T, P extends Record<string, any> = Record<string, any>>(endpoint: string) {
  return () => {
    const dispatch = useDispatch();
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const execute = useCallback(async (params?: P) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(endpoint, params);
        setData(response.data as T);
        return response.data;
      } catch (error: any) {
        const errorMessage = error.message || 'An error occurred';
        setError(errorMessage);
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
      } finally {
        setLoading(false);
      }
    }, [endpoint]);

    const create = useCallback(async (data: T) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post(endpoint, data);
        return response.data;
      } catch (error: any) {
        const errorMessage = error.message || 'An error occurred';
        setError(errorMessage);
        console.error(`Error creating ${endpoint}:`, error);
        throw error;
      } finally {
        setLoading(false);
      }
    }, [endpoint]);

    const update = useCallback(async (id: string, data: Partial<T>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.put(`${endpoint}/${id}`, data);
        return response.data;
      } catch (error: any) {
        const errorMessage = error.message || 'An error occurred';
        setError(errorMessage);
        console.error(`Error updating ${endpoint}:`, error);
        throw error;
      } finally {
        setLoading(false);
      }
    }, [endpoint]);

    const remove = useCallback(async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.delete(`${endpoint}/${id}`);
        return response.data;
      } catch (error: any) {
        const errorMessage = error.message || 'An error occurred';
        setError(errorMessage);
        console.error(`Error deleting ${endpoint}:`, error);
        throw error;
      } finally {
        setLoading(false);
      }
    }, [endpoint]);

    return { 
      execute, 
      create, 
      update, 
      remove, 
      data, 
      loading, 
      error,
      reset: () => {
        setData(null);
        setLoading(false);
        setError(null);
      }
    };
  };
}

// Community API hooks
export const useCommunity = () => {
  const dispatch = useDispatch();

  // Posts
  const posts = {
    getAll: createApiHook<Post[], CommunityFilter>('/community/posts')(),
    getById: createApiHook<Post>('/community/posts')(),
    create: createApiHook<PostForm>('/community/posts')(),
    update: createApiHook<Partial<PostForm>>('/community/posts')(),
    delete: createApiHook<void>('/community/posts')(),
    like: createApiHook<void>('/community/posts')(),
    unlike: createApiHook<void>('/community/posts')(),
    bookmark: createApiHook<void>('/community/posts')(),
    unbookmark: createApiHook<void>('/community/posts')(),
  };

  // Blogs
  const blogs = {
    getAll: createApiHook<Blog[], CommunityFilter>('/community/blogs')(),
    getById: createApiHook<Blog>('/community/blogs')(),
    create: createApiHook<BlogForm>('/community/blogs')(),
    update: createApiHook<Partial<BlogForm>>('/community/blogs')(),
    delete: createApiHook<void>('/community/blogs')(),
    like: createApiHook<void>('/community/blogs')(),
    unlike: createApiHook<void>('/community/blogs')(),
    bookmark: createApiHook<void>('/community/blogs')(),
    unbookmark: createApiHook<void>('/community/blogs')(),
  };

  // Comments
  const comments = {
    create: createApiHook<CommentForm>('/community/comments')(),
    update: createApiHook<Partial<CommentForm>>('/community/comments')(),
    delete: createApiHook<void>('/community/comments')(),
    like: createApiHook<void>('/community/comments')(),
    unlike: createApiHook<void>('/community/comments')(),
  };

  // Users
  const users = {
    getProfile: createApiHook<User>('/community/profile')(),
    updateProfile: createApiHook<Partial<User>>('/community/profile')(),
    getSuggested: createApiHook<User[], { page?: number; limit?: number }>('/community/users/suggested')(),
    follow: createApiHook<void>('/community/users')(),
    unfollow: createApiHook<void>('/community/users')(),
    getFollowers: createApiHook<User[], { page?: number; limit?: number }>('/community/users')(),
    getFollowing: createApiHook<User[], { page?: number; limit?: number }>('/community/users')(),
  };

  // Messages
  const messages = {
    getConversations: createApiHook<Conversation[]>('/community/messages/conversations')(),
    getMessages: createApiHook<Message[], { conversationId: string; page?: number; limit?: number }>('/community/messages')(),
    sendMessage: createApiHook<{ content: string; receiverId: string }>('/community/messages')(),
    markAsRead: createApiHook<void>('/community/messages')(),
  };

  // Notifications
  const notifications = {
    getAll: createApiHook<Notification[], { page?: number; limit?: number }>('/community/notifications')(),
    markAsRead: createApiHook<void>('/community/notifications')(),
    markAllAsRead: createApiHook<void>('/community/notifications')(),
  };

  // Bookmarks
  const bookmarks = {
    getAll: createApiHook<Bookmark[], { page?: number; limit?: number }>('/community/bookmarks')(),
    add: createApiHook<{ type: 'POST' | 'BLOG'; postId?: string; blogId?: string }>('/community/bookmarks')(),
    remove: createApiHook<void>('/community/bookmarks')(),
  };

  return {
    posts,
    blogs,
    comments,
    users,
    messages,
    notifications,
    bookmarks,
  };
};

// News API hooks
export const useNews = () => {
  const dispatch = useDispatch();

  const news = {
    getAll: createApiHook<News[], NewsFilter>('/news')(),
    getById: createApiHook<News>('/news')(),
    getTrending: createApiHook<News[]>('/news/trending')(),
    getByCategory: createApiHook<News[], { category: string; page?: number; limit?: number }>('/news/category')(),
    search: createApiHook<News[], { query: string; page?: number; limit?: number }>('/news/search')(),
  };

  const market = {
    getOverview: createApiHook<MarketOverview>('/news/market/overview')(),
    getStocks: createApiHook<Stock[], { category?: string; page?: number; limit?: number }>('/news/market/stocks')(),
    getStockById: createApiHook<Stock>('/news/market/stocks')(),
    searchStocks: createApiHook<Stock[], { query: string }>('/news/market/stocks/search')(),
  };

  return { news, market };
};

// Questions API hooks
export const useQuestions = () => {
  const dispatch = useDispatch();

  const questions = {
    getAll: createApiHook<Question[], QuestionFilter>('/ask/questions')(),
    getById: createApiHook<Question>('/ask/questions')(),
    getMyQuestions: createApiHook<Question[], { page?: number; limit?: number }>('/ask/questions/my')(),
    create: createApiHook<QuestionForm>('/ask/questions')(),
    update: createApiHook<Partial<QuestionForm>>('/ask/questions')(),
    delete: createApiHook<void>('/ask/questions')(),
    like: createApiHook<void>('/ask/questions')(),
    unlike: createApiHook<void>('/ask/questions')(),
    markAsAnswered: createApiHook<void>('/ask/questions')(),
  };

  const answers = {
    create: createApiHook<QuestionCommentForm>('/ask/answers')(),
    update: createApiHook<Partial<QuestionCommentForm>>('/ask/answers')(),
    delete: createApiHook<void>('/ask/answers')(),
    like: createApiHook<void>('/ask/answers')(),
    unlike: createApiHook<void>('/ask/answers')(),
    markAsBest: createApiHook<void>('/ask/answers')(),
  };

  return { questions, answers };
};

// File upload hook
export const useFileUpload = () => {
  const upload = useCallback(async (file: File, type: 'image' | 'document') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      const response = await apiClient.upload('/upload', formData);
      
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }, []);

  return { upload };
};

// Search hook
export const useSearch = () => {
  const search = useCallback(async (query: string, type: 'posts' | 'blogs' | 'users' | 'questions' | 'news') => {
    try {
      const response = await apiClient.get('/search', { q: query, type });
      return response.data;
    } catch (error) {
      console.error('Error searching:', error);
      throw error;
    }
  }, []);

  return { search };
}; 