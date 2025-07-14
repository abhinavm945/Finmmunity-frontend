import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// --- Async Thunks ---

// Blogs
export const fetchBlogs = createAsyncThunk(
  "community/fetchBlogs",
  async (params, thunkAPI) => {
    const res = await axios.get(`${API_BASE_URL}/community/blogs`, {
      params,
      withCredentials: true,
    });
    return res.data.blogs;
  }
);
export const fetchBlogById = createAsyncThunk(
  "community/fetchBlogById",
  async (id, thunkAPI) => {
    const res = await axios.get(`${API_BASE_URL}/community/blogs/${id}`, {
      withCredentials: true,
    });
    return res.data.blog;
  }
);
export const createBlog = createAsyncThunk(
  "community/createBlog",
  async (formData, thunkAPI) => {
    const res = await axios.post(`${API_BASE_URL}/community/blogs`, formData, {
      withCredentials: true,
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
      { withCredentials: true }
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
      { withCredentials: true }
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
    });
    return res.data.posts;
  }
);
export const fetchPostById = createAsyncThunk(
  "community/fetchPostById",
  async (id, thunkAPI) => {
    const res = await axios.get(`${API_BASE_URL}/community/posts/${id}`, {
      withCredentials: true,
    });
    return res.data.post;
  }
);
export const createPost = createAsyncThunk(
  "community/createPost",
  async (formData, thunkAPI) => {
    const res = await axios.post(`${API_BASE_URL}/community/posts`, formData, {
      withCredentials: true,
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
      { withCredentials: true }
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
      { withCredentials: true }
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
      { withCredentials: true }
    );
    return res.data.comment;
  }
);
export const deleteComment = createAsyncThunk(
  "community/deleteComment",
  async (id, thunkAPI) => {
    await axios.delete(`${API_BASE_URL}/community/comments/${id}`, {
      withCredentials: true,
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
      { withCredentials: true }
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
      { withCredentials: true }
    );
    return { id, following: res.data.following };
  }
);
export const fetchSuggestedUsers = createAsyncThunk(
  "community/fetchSuggestedUsers",
  async (params, thunkAPI) => {
    const res = await axios.get(`${API_BASE_URL}/community/users/suggested`, {
      params,
      withCredentials: true,
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
    });
    return res.data.trending;
  }
);
export const fetchDiscovery = createAsyncThunk(
  "community/fetchDiscovery",
  async (params, thunkAPI) => {
    const res = await axios.get(`${API_BASE_URL}/community/discover`, {
      params,
      withCredentials: true,
    });
    return res.data.discovery;
  }
);

// --- Slice ---

const communitySlice = createSlice({
  name: "community",
  initialState: {
    blogs: [],
    posts: [],
    comments: [],
    bookmarks: [],
    suggestedUsers: [],
    trending: [],
    discovery: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCommunityError(state) {
      state.error = null;
    },
    clearCommunityLoading(state) {
      state.loading = false;
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
            blog.likes.push("currentUser"); // Replace with actual user id
          } else {
            blog.likes = blog.likes.filter((id) => id !== "currentUser");
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
            post.likes.push("currentUser"); // Replace with actual user id
          } else {
            post.likes = post.likes.filter((id) => id !== "currentUser");
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
        }
      })
      .addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
        state.suggestedUsers = action.payload;
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
  },
});

export default communitySlice.reducer;
export const { clearCommunityError, clearCommunityLoading } =
  communitySlice.actions;
