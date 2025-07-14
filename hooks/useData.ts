import { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../redux/store'; // Uncomment if you have RootState type

// Custom hook for accessing centralized data
export const useData = () => {
  const dispatch = useDispatch();
  // Example: update these to use new slices
  const posts = useSelector((state) => state.community.posts);
  const blogs = useSelector((state) => state.community.blogs);
  const news = useSelector((state) => state.news.news);
  const questions = useSelector((state) => state.ask.questions);

  // Add your fetch thunks here as needed
  // Example:
  // const fetchPosts = useCallback(() => dispatch(fetchPosts()), [dispatch]);

  return {
    posts,
    blogs,
    news,
    questions,
    // fetchPosts,
    // fetchBlogs,
    // fetchNews,
    // fetchQuestions,
  };
};

// Hook for community data specifically
export const useCommunityData = () => {
  const posts = useSelector((state: RootState) => state.community.posts);
  const blogs = useSelector((state: RootState) => state.community.blogs);
  const suggestedUsers = useSelector((state: RootState) => state.community.suggestedUsers || []);
  const isLoading = useSelector((state: RootState) => state.community.isLoading);
  const error = useSelector((state: RootState) => state.community.error);

  useEffect(() => {
    console.log('Community Data (Posts):', posts);
  }, [posts]);
  useEffect(() => {
    console.log('Community Data (Blogs):', blogs);
  }, [blogs]);
  useEffect(() => {
    console.log('Community Data (Suggested Users):', suggestedUsers);
  }, [suggestedUsers]);

  return {
    posts: { data: posts, loading: isLoading, error, fetch: () => {} },
    blogs: { data: blogs, loading: isLoading, error, fetch: () => {} },
    suggestedUsers,
    bookmarkedItems: [
      ...(posts?.filter((post: any) => post.isBookmarked) || []),
      ...(blogs?.filter((blog: any) => blog.isBookmarked) || []),
    ],
  };
};

// Hook for news data specifically
export const useNewsData = () => {
  const { news, trendingNews, marketOverview, stocks } = useData();
  
  return {
    news,
    trendingNews,
    marketOverview,
    stocks,
  };
};

// Hook for questions data specifically
export const useQuestionsData = () => {
  const { questions, myQuestions } = useData();
  
  return {
    questions,
    myQuestions,
  };
};

// Empty state messages for different components
export const getEmptyStateMessage = (type: string, hasError?: boolean) => {
  if (hasError) {
    return {
      title: "Something went wrong",
      message: "We couldn't load the data. Please try again later.",
      action: "Retry",
    };
  }

  switch (type) {
    case 'posts':
      return {
        title: "No posts yet",
        message: "Be the first to share your thoughts with the community!",
        action: "Create Post",
      };
    case 'blogs':
      return {
        title: "No blogs yet",
        message: "Start writing and share your knowledge with others!",
        action: "Write Blog",
      };
    default:
      return {
        title: "No data available",
        message: "There's nothing to show here right now.",
        action: "Refresh",
      };
  }
}; 