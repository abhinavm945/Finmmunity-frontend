import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../utils/api";

// --- Async Thunks ---

export const fetchNews = createAsyncThunk(
  "news/fetchNews",
  async (params, thunkAPI) => {
    const res = await api.client.get("/news", params);
    const newsArray = Array.isArray(res.data?.data) ? res.data.data : [];
    return newsArray;
  }
);
export const fetchNewsById = createAsyncThunk(
  "news/fetchNewsById",
  async (id, thunkAPI) => {
    const res = await api.client.get(`/news/${id}`, { withCredentials: true });
    return res.data.news;
  }
);
export const createNews = createAsyncThunk(
  "news/createNews",
  async (formData, thunkAPI) => {
    const res = await api.client.post("/news", formData, {
      withCredentials: true,
    });
    return res.data.news;
  }
);
export const updateNews = createAsyncThunk(
  "news/updateNews",
  async ({ id, formData }, thunkAPI) => {
    const res = await api.client.put(`/news/${id}`, formData, {
      withCredentials: true,
    });
    return res.data.news;
  }
);
export const deleteNews = createAsyncThunk(
  "news/deleteNews",
  async (id, thunkAPI) => {
    await api.client.delete(`/news/${id}`, { withCredentials: true });
    return id;
  }
);
export const fetchTrendingNews = createAsyncThunk(
  "news/fetchTrendingNews",
  async (params, thunkAPI) => {
    const res = await api.client.get("/news/trending", {
      params,
      withCredentials: true,
    });
    return res.data.trending;
  }
);

// --- Slice ---

const newsSlice = createSlice({
  name: "news",
  initialState: {
    news: [],
    trending: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearNewsError(state) {
      state.error = null;
    },
    clearNewsLoading(state) {
      state.loading = false;
    },
    clearNews(state) {
      state.news = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchNewsById.fulfilled, (state, action) => {
        /* Optionally update single news */
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.news.unshift(action.payload);
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.news = state.news.map((n) =>
          n.id === action.payload.id ? action.payload : n
        );
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.news = state.news.filter((n) => n.id !== action.payload);
      })
      .addCase(fetchTrendingNews.fulfilled, (state, action) => {
        state.trending = action.payload;
      });
  },
});

export default newsSlice.reducer;
export const { clearNewsError, clearNewsLoading, clearNews } =
  newsSlice.actions;
