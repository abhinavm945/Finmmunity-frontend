import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../utils/api";

// --- Async Thunks ---

// Questions
export const fetchQuestions = createAsyncThunk(
  "ask/fetchQuestions",
  async (params, thunkAPI) => {
    const res = await api.client.get("/questions", {
      params,
      withCredentials: true,
    });
    console.log("Questions API Response:", res.data);
    // Extract questions from the correct structure: data.data (which is an array)
    const questions = Array.isArray(res.data.data) ? res.data.data : [];
    console.log("Extracted questions:", questions);
    return questions;
  }
);
export const fetchQuestionById = createAsyncThunk(
  "ask/fetchQuestionById",
  async (id, thunkAPI) => {
    const res = await api.client.get(`/questions/${id}`, {
      withCredentials: true,
    });
    console.log("Question by ID API Response:", res.data);
    // Extract question from the nested structure: data.data.data
    const question = res.data.data?.data || res.data.question;
    console.log("Extracted question:", question);
    return question;
  }
);
export const createQuestion = createAsyncThunk(
  "ask/createQuestion",
  async (formData, thunkAPI) => {
    const res = await api.client.post("/questions", formData, {
      withCredentials: true,
    });
    return res.data.question;
  }
);
export const updateQuestion = createAsyncThunk(
  "ask/updateQuestion",
  async ({ id, formData }, thunkAPI) => {
    const res = await api.client.put(`/questions/${id}`, formData, {
      withCredentials: true,
    });
    return res.data.question;
  }
);
export const deleteQuestion = createAsyncThunk(
  "ask/deleteQuestion",
  async (id, thunkAPI) => {
    await api.client.delete(`/questions/${id}`, { withCredentials: true });
    return id;
  }
);

// Answers
export const createAnswer = createAsyncThunk(
  "ask/createAnswer",
  async ({ questionId, formData }, thunkAPI) => {
    const res = await api.client.post(
      `/questions/${questionId}/answers`,
      formData,
      {
        withCredentials: true,
      }
    );
    return res.data.answer;
  }
);
export const updateAnswer = createAsyncThunk(
  "ask/updateAnswer",
  async ({ id, formData }, thunkAPI) => {
    const res = await api.client.put(`/questions/answers/${id}`, formData, {
      withCredentials: true,
    });
    return res.data.answer;
  }
);
export const deleteAnswer = createAsyncThunk(
  "ask/deleteAnswer",
  async (id, thunkAPI) => {
    await api.client.delete(`/questions/answers/${id}`, {
      withCredentials: true,
    });
    return id;
  }
);

// Comments
export const addComment = createAsyncThunk(
  "ask/addComment",
  async (data, thunkAPI) => {
    // data: { questionId, answerId, text }
    const res = await api.client.post("/questions/comments", data, {
      withCredentials: true,
    });
    return res.data.comment;
  }
);
export const updateComment = createAsyncThunk(
  "ask/updateComment",
  async ({ id, text }, thunkAPI) => {
    const res = await api.client.put(
      `/questions/comments/${id}`,
      { text },
      { withCredentials: true }
    );
    return res.data.comment;
  }
);
export const deleteComment = createAsyncThunk(
  "ask/deleteComment",
  async (id, thunkAPI) => {
    await api.client.delete(`/questions/comments/${id}`, {
      withCredentials: true,
    });
    return id;
  }
);
export const likeComment = createAsyncThunk(
  "ask/likeComment",
  async (id, thunkAPI) => {
    const res = await api.client.post(
      `/questions/comments/${id}/like`,
      {},
      { withCredentials: true }
    );
    return { id, liked: res.data.liked };
  }
);

// --- Slice ---

const askSlice = createSlice({
  name: "ask",
  initialState: {
    questions: [],
    answers: [],
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAskError(state) {
      state.error = null;
    },
    clearAskLoading(state) {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Questions reducer - payload:", action.payload);
        state.questions = action.payload;
        console.log("Questions reducer - state.questions:", state.questions);
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchQuestionById.fulfilled, (state, action) => {
        /* Optionally update single question */
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.questions.unshift(action.payload);
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.map((q) =>
          q.id === action.payload.id ? action.payload : q
        );
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter(
          (q) => q.id !== action.payload
        );
      })
      // Answers
      .addCase(createAnswer.fulfilled, (state, action) => {
        state.answers.unshift(action.payload);
      })
      .addCase(updateAnswer.fulfilled, (state, action) => {
        state.answers = state.answers.map((a) =>
          a.id === action.payload.id ? action.payload : a
        );
      })
      .addCase(deleteAnswer.fulfilled, (state, action) => {
        state.answers = state.answers.filter((a) => a.id !== action.payload);
      })
      // Comments
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
  },
});

export default askSlice.reducer;
export const { clearAskError, clearAskLoading } = askSlice.actions;
