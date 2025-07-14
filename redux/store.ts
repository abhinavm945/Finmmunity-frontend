import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userSlice";
import newsReducer from "./newsSlice";
import askReducer from "./askSlice";
import communityReducer from "./communitySlice";
import uiReducer from "./uiSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // add other slices if needed
};

const appReducer = combineReducers({
  user: userReducer,
  news: newsReducer,
  ask: askReducer,
  community: communityReducer,
  ui: uiReducer,
});

// Root reducer that can reset all state
const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: { type: string }) => {
  if (action.type === "LOGOUT") {
    // Clear persisted storage
    storage.removeItem("persist:root");
    // Return initial state
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Method to clear all Redux state
export const clearAllState = () => {
  store.dispatch({ type: "LOGOUT" });
  persistor.purge();
};

export default store;

export type RootState = ReturnType<typeof store.getState>;
