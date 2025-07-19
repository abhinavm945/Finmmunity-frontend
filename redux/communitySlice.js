import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Helper to get Authorization header from localStorage
function getAuthHeaders() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

// --- Async Thunks ---

// Blogs
export const fetchBlogs = createAsyncThunk(
  "community/fetchBlogs",
  async (params, thunkAPI) => {
    const res = await axios.get(`${API_BASE_URL}/community/blogs`, {
      params,
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    return res.data.blogs;
  }
);
export const fetchBlogById = createAsyncThunk(
  "community/fetchBlogById",
  async (id, thunkAPI) => {
    const res = await axios.get(`${API_BASE_URL}/community/blogs/${id}`, {
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    return res.data.blog;
  }
);
export const createBlog = createAsyncThunk(
  "community/createBlog",
  async (formData, thunkAPI) => {
    const res = await axios.post(`${API_BASE_URL}/community/blogs`, formData, {
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    return res.data.blog;
  }
);
export const updateBlog = createAsyncThunk(
  "community/updateBlog",
  async ({ id, formData }, thunkAPI) => {
    const res = await axios.put(
      `${API_BASE_URL}/community/blogs/${id}`,
      formData,
      {
        withCredentials: true,
        headers: getAuthHeaders(),
      }
    );
    return res.data.blog;
  }
);
export const deleteBlog = createAsyncThunk(
  "community/deleteBlog",
  async (id, thunkAPI) => {
    await axios.delete(`${API_BASE_URL}/community/blogs/${id}`, {
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    return id;
  }
);
export const likeBlog = createAsyncThunk(
  "community/likeBlog",
  async (id, thunkAPI) => {
    const res = await axios.post(
      `${API_BASE_URL}/community/blogs/${id}/like`,
      {},
      { withCredentials: true, headers: getAuthHeaders() }
    );
    return { id, liked: res.data.liked };
  }
);
export const bookmarkBlog = createAsyncThunk(
  "community/bookmarkBlog",
  async (id, thunkAPI) => {
    const res = await axios.post(
      `${API_BASE_URL}/community/blogs/${id}/bookmark`,
      {},
      { withCredentials: true, headers: getAuthHeaders() }
    );
    return { id, bookmarked: res.data.bookmarked };
  }
);

// Posts
export const fetchPosts = createAsyncThunk(
  "community/fetchPosts",
  async (params, thunkAPI) => {
    const res = await axios.get(`${API_BASE_URL}/community/posts`, {
      params,
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    return res.data.posts;
  }
);
export const fetchPostById = createAsyncThunk(
  "community/fetchPostById",
  async (id, thunkAPI) => {
    const res = await axios.get(`${API_BASE_URL}/community/posts/${id}`, {
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    return res.data.post;
  }
);
export const createPost = createAsyncThunk(
  "community/createPost",
  async (formData, thunkAPI) => {
    const res = await axios.post(`${API_BASE_URL}/community/posts`, formData, {
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    return res.data.post;
  }
);
export const updatePost = createAsyncThunk(
  "community/updatePost",
  async ({ id, formData }, thunkAPI) => {
    const res = await axios.put(
      `${API_BASE_URL}/community/posts/${id}`,
      formData,
      {
        withCredentials: true,
        headers: getAuthHeaders(),
      }
    );
    return res.data.post;
  }
);
export const deletePost = createAsyncThunk(
  "community/deletePost",
  async (id, thunkAPI) => {
    await axios.delete(`${API_BASE_URL}/community/posts/${id}`, {
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    return id;
  }
);
export const likePost = createAsyncThunk(
  "community/likePost",
  async (id, thunkAPI) => {
    const res = await axios.post(
      `${API_BASE_URL}/community/posts/${id}/like`,
      {},
      { withCredentials: true, headers: getAuthHeaders() }
    );
    return { id, liked: res.data.liked };
  }
);
export const bookmarkPost = createAsyncThunk(
  "community/bookmarkPost",
  async (id, thunkAPI) => {
    const res = await axios.post(
      `${API_BASE_URL}/community/posts/${id}/bookmark`,
      {},
      { withCredentials: true, headers: getAuthHeaders() }
    );
    return { id, bookmarked: res.data.bookmarked };
  }
);

// Comments (for both blogs and posts)
export const addComment = createAsyncThunk(
  "community/addComment",
  async (data, thunkAPI) => {
    // data: { postId, blogId, content }
    const res = await axios.post(`${API_BASE_URL}/community/comments`, data, {
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    return res.data.comment;
  }
);
export const updateComment = createAsyncThunk(
  "community/updateComment",
  async ({ id, content }, thunkAPI) => {
    const res = await axios.put(
      `${API_BASE_URL}/community/comments/${id}`,
      { content },
      { withCredentials: true, headers: getAuthHeaders() }
    );
    return res.data.comment;
  }
);
export const deleteComment = createAsyncThunk(
  "community/deleteComment",
  async (id, thunkAPI) => {
    await axios.delete(`${API_BASE_URL}/community/comments/${id}`, {
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    return id;
  }
);
export const likeComment = createAsyncThunk(
  "community/likeComment",
  async (id, thunkAPI) => {
    const res = await axios.post(
      `${API_BASE_URL}/community/comments/${id}/like`,
      {},
      { withCredentials: true, headers: getAuthHeaders() }
    );
    return { id, liked: res.data.liked };
  }
);

// User Interactions
export const followUser = createAsyncThunk(
  "community/followUser",
  async (id, thunkAPI) => {
    const res = await axios.post(
      `${API_BASE_URL}/community/users/${id}/follow`,
      {},
      { withCredentials: true, headers: getAuthHeaders() }
    );
    return {
      id,
      following: res.data.following,
      followerCount: res.data.followerCount,
    };
  }
);

// Unfollow user (same endpoint as follow, just different action)
export const unfollowUser = createAsyncThunk(
  "community/unfollowUser",
  async (id, thunkAPI) => {
    const res = await axios.post(
      `${API_BASE_URL}/community/users/${id}/follow`,
      {},
      { withCredentials: true, headers: getAuthHeaders() }
    );
    return {
      id,
      following: res.data.following,
      followerCount: res.data.followerCount,
    };
  }
);
export const fetchSuggestedUsers = createAsyncThunk(
  "community/fetchSuggestedUsers",
  async (params, thunkAPI) => {
    const res = await axios.get(`${API_BASE_URL}/community/users/suggested`, {
      params,
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    return res.data.users;
  }
);
export const fetchBookmarks = createAsyncThunk(
  "community/fetchBookmarks",
  async (params, thunkAPI) => {
    const res = await axios.get(`${API_BASE_URL}/community/users/bookmarks`, {
      params,
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    return res.data.bookmarks;
  }
);

// Trending & Discovery
export const fetchTrending = createAsyncThunk(
  "community/fetchTrending",
  async (params, thunkAPI) => {
    const res = await axios.get(`${API_BASE_URL}/community/trending`, {
      params,
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    return res.data.data; // Fix: use .data, not .trending
  }
);
export const fetchDiscovery = createAsyncThunk(
  "community/fetchDiscovery",
  async (params, thunkAPI) => {
    const res = await axios.get(`${API_BASE_URL}/community/discover`, {
      params,
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    return res.data.discovery;
  }
);

// Search all users
export const searchUsers = createAsyncThunk(
  "community/searchUsers",
  async (query, thunkAPI) => {
    console.log("Searching for users with query:", query);
    const res = await axios.get(`${API_BASE_URL}/users/search`, {
      params: { query },
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    console.log("Search response:", res.data);
    return res.data.data.users;
  }
);

// User-specific content
export const fetchUserBlogs = createAsyncThunk(
  "community/fetchUserBlogs",
  async (userId, thunkAPI) => {
    const res = await axios.get(`${API_BASE_URL}/users/${userId}/blogs`, {
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    return res.data.data; // Backend returns { data: blogs[] }
  }
);

export const fetchUserPosts = createAsyncThunk(
  "community/fetchUserPosts",
  async (userId, thunkAPI) => {
    const res = await axios.get(`${API_BASE_URL}/users/${userId}/posts`, {
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    return res.data.data; // Backend returns { data: posts[] }
  }
);

// --- Slice ---

const communitySlice = createSlice({
  name: "community",
  initialState: {
    blogs: [],
    posts: [],
    userBlogs: [], // Separate state for user-specific blogs
    userPosts: [], // Separate state for user-specific posts
    comments: [],
    bookmarks: [],
    suggestedUsers: [],
    searchResults: [],
    trending: [],
    discovery: [],
    loading: false,
    searchLoading: false,
    suggestedUsersLoading: false,
    error: null,
  },
  reducers: {
    clearCommunityError(state) {
      state.error = null;
    },
    clearCommunityLoading(state) {
      state.loading = false;
    },
    clearSearchResults(state) {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    // Blogs
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        /* Optionally update single blog */
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.unshift(action.payload);
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.map((b) =>
          b.id === action.payload.id ? action.payload : b
        );
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((b) => b.id !== action.payload);
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        const blog = state.blogs.find((b) => b.id === action.payload.id);
        if (blog) {
          if (action.payload.liked) {
            // Add current user to likes
            const currentUser = {
              userId: "currentUser",
              id: Date.now().toString(),
            };
            blog.likes.push(currentUser);
          } else {
            // Remove current user from likes
            blog.likes = blog.likes.filter((like) =>
              typeof like === "string"
                ? like !== "currentUser"
                : like.userId !== "currentUser"
            );
          }
        }
      })
      .addCase(bookmarkBlog.fulfilled, (state, action) => {
        const blog = state.blogs.find((b) => b.id === action.payload.id);
        if (blog) {
          blog.isBookmarked = action.payload.bookmarked;
        }
      });
    // Posts
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        /* Optionally update single post */
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.posts = state.posts.map((p) =>
          p.id === action.payload.id ? action.payload : p
        );
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.id);
        if (post) {
          if (action.payload.liked) {
            // Add current user to likes
            const currentUser = {
              userId: "currentUser",
              id: Date.now().toString(),
            };
            post.likes.push(currentUser);
          } else {
            // Remove current user from likes
            post.likes = post.likes.filter((like) =>
              typeof like === "string"
                ? like !== "currentUser"
                : like.userId !== "currentUser"
            );
          }
        }
      })
      .addCase(bookmarkPost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.id);
        if (post) {
          post.isBookmarked = action.payload.bookmarked;
        }
      });
    // Comments
    builder
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.comments = state.comments.map((c) =>
          c.id === action.payload.id ? action.payload : c
        );
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c.id !== action.payload);
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        const comment = state.comments.find((c) => c.id === action.payload.id);
        if (comment) {
          if (action.payload.liked) {
            comment.likes.push("currentUser"); // Replace with actual user id
          } else {
            comment.likes = comment.likes.filter((id) => id !== "currentUser");
          }
        }
      });
    // User Interactions
    builder
      .addCase(followUser.fulfilled, (state, action) => {
        const user = state.suggestedUsers.find(
          (u) => u.id === action.payload.id
        );
        if (user) {
          user.isFollowing = action.payload.following;
          user._count.followers = action.payload.followerCount; // Use accurate count from backend
        }
        // Also update in search results
        const searchUser = state.searchResults.find(
          (u) => u.id === action.payload.id
        );
        if (searchUser) {
          searchUser.isFollowing = action.payload.following;
          searchUser._count.followers = action.payload.followerCount; // Use accurate count from backend
        }
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const user = state.suggestedUsers.find(
          (u) => u.id === action.payload.id
        );
        if (user) {
          user.isFollowing = action.payload.following;
          user._count.followers = action.payload.followerCount; // Use accurate count from backend
        }
        // Also update in search results
        const searchUser = state.searchResults.find(
          (u) => u.id === action.payload.id
        );
        if (searchUser) {
          searchUser.isFollowing = action.payload.following;
          searchUser._count.followers = action.payload.followerCount; // Use accurate count from backend
        }
      })
      .addCase(fetchSuggestedUsers.pending, (state) => {
        state.suggestedUsersLoading = true;
        state.error = null;
      })
      .addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
        state.suggestedUsersLoading = false;
        state.suggestedUsers = action.payload;
      })
      .addCase(fetchSuggestedUsers.rejected, (state, action) => {
        state.suggestedUsersLoading = false;
        state.error = action.error.message;
      })
      .addCase(searchUsers.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.bookmarks = action.payload;
      });
    // Trending & Discovery
    builder
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.trending = action.payload;
      })
      .addCase(fetchDiscovery.fulfilled, (state, action) => {
        state.discovery = action.payload;
      });
    // User-specific content
    builder
      .addCase(fetchUserBlogs.fulfilled, (state, action) => {
        state.userBlogs = action.payload || []; // Ensure it's always an array
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.userPosts = action.payload || []; // Ensure it's always an array
      });
  },
});

export default communitySlice.reducer;
export const {
  clearCommunityError,
  clearCommunityLoading,
  clearSearchResults,
} = communitySlice.actions;
