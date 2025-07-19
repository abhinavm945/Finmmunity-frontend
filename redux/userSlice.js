import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../utils/api";

// --- Async Thunks ---

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, thunkAPI) => {
    const response = await api.auth.login(credentials); // This sets the token!
    if (response.success && response.data?.token) {
      // Token is already set by api.auth.login
    }
    return response.data.user;
  }
);
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, thunkAPI) => {
    await api.client.post("/auth/logout", {}, { withCredentials: true });
    return null;
  }
);
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (data, thunkAPI) => {
    const res = await api.client.post("/auth/register", data, {
      withCredentials: true,
    });
    return res.data.user;
  }
);
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (id, thunkAPI) => {
    const res = await api.client.get(`/users/${id}`);
    // The backend returns { user: { ... } }
    return res.data.user;
  }
);
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (formData, thunkAPI) => {
    const res = await api.client.put("/user/edit", formData, {
      withCredentials: true,
    });
    return res.data.user;
  }
);
export const followOrUnfollowUser = createAsyncThunk(
  "user/followOrUnfollowUser",
  async (id, thunkAPI) => {
    const res = await api.client.post(`/community/users/${id}/follow`);
    // The backend returns { following: true/false }
    return { id, following: res.data.following };
  }
);
export const fetchFollowers = createAsyncThunk(
  "user/fetchFollowers",
  async (id, thunkAPI) => {
    const res = await api.client.get(`/users/${id}/followers`);
    // The backend returns { data: [ ... ] } or { followers: [ ... ] }
    return res.data.data || res.data.followers;
  }
);
export const fetchFollowing = createAsyncThunk(
  "user/fetchFollowing",
  async (id, thunkAPI) => {
    const res = await api.client.get(`/users/${id}/following`);
    // The backend returns { data: [ ... ] } or { following: [ ... ] }
    return res.data.data || res.data.following;
  }
);
export const fetchUserBookmarks = createAsyncThunk(
  "user/fetchUserBookmarks",
  async (_, thunkAPI) => {
    const res = await api.client.get("/user/bookmarks", {
      withCredentials: true,
    });
    return res.data.bookmarks;
  }
);
export const fetchUserNotifications = createAsyncThunk(
  "user/fetchUserNotifications",
  async (id, thunkAPI) => {
    const res = await api.client.get(`/user/${id}/notifications`, {
      withCredentials: true,
    });
    return res.data.notifications;
  }
);

export const unfollowUser = createAsyncThunk(
  "user/unfollowUser",
  async (userId, thunkAPI) => {
    const res = await api.client.post(`/community/users/${userId}/follow`);
    return { userId, following: res.data.following };
  }
);

export const removeFollower = createAsyncThunk(
  "user/removeFollower",
  async (followerId, thunkAPI) => {
    const res = await api.client.delete(`/users/followers/${followerId}`);
    return { followerId, removed: res.data.success };
  }
);

// --- Slice ---

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
    profile: null,
    followers: [],
    following: [],
    bookmarks: [],
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearUserError(state) {
      state.error = null;
    },
    clearUserLoading(state) {
      state.loading = false;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setProfile(state, action) {
      state.profile = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    logoutUserState(state) {
      state.user = null;
      state.token = null;
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        // Normalize user object to always have 'id'
        let user = action.payload;
        if (user && user._id && !user.id) user.id = user._id;
        state.user = user;
        // Set token from localStorage (set by api.auth.login)
        state.token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.profile = null;
        if (typeof window !== "undefined") localStorage.removeItem("token");
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        let user = action.payload;
        if (user && user._id && !user.id) user.id = user._id;
        state.user = user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        let profile = action.payload;
        if (profile && profile._id && !profile.id) profile.id = profile._id;
        state.profile = profile;
        state.error = null; // clear error on success
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        let profile = action.payload;
        if (profile && profile._id && !profile.id) profile.id = profile._id;
        state.profile = profile;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Follow/Unfollow
      .addCase(followOrUnfollowUser.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.isFollowing = action.payload.following;
        }
      })
      // Followers
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followers = action.payload;
        state.error = null; // clear error on success
      })
      // Following
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.following = action.payload;
        state.error = null; // clear error on success
      })
      // Unfollow user
      .addCase(unfollowUser.fulfilled, (state, action) => {
        // Remove user from following list
        state.following = state.following.filter(
          (user) => user.id !== action.payload.userId
        );
      })
      // Remove follower
      .addCase(removeFollower.fulfilled, (state, action) => {
        // Remove user from followers list
        state.followers = state.followers.filter(
          (user) => user.id !== action.payload.followerId
        );
      })
      // Bookmarks
      .addCase(fetchUserBookmarks.fulfilled, (state, action) => {
        state.bookmarks = action.payload;
      })
      // Notifications
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      });
  },
});

export default userSlice.reducer;
export const {
  clearUserError,
  clearUserLoading,
  setUser,
  setProfile,
  setToken,
  logoutUserState,
} = userSlice.actions;

// Action to clear all Redux state
export const logoutAll = () => ({
  type: "LOGOUT",
});
