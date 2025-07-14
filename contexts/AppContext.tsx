"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Types
interface AppState {
  currentSection: "news" | "community" | "ask";
  userPreferences: {
    theme: "light" | "dark";
    notifications: boolean;
    autoRefresh: boolean;
  };
  navigation: {
    breadcrumbs: Array<{ label: string; path: string }>;
    activeTab: string;
  };
}

type AppAction =
  | { type: "SET_SECTION"; payload: "news" | "community" | "ask" }
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "TOGGLE_NOTIFICATIONS" }
  | { type: "TOGGLE_AUTO_REFRESH" }
  | { type: "SET_BREADCRUMBS"; payload: Array<{ label: string; path: string }> }
  | { type: "SET_ACTIVE_TAB"; payload: string };

// Initial state
const initialState: AppState = {
  currentSection: "news",
  userPreferences: {
    theme: "light",
    notifications: true,
    autoRefresh: false,
  },
  navigation: {
    breadcrumbs: [{ label: "Home", path: "/" }],
    activeTab: "NEWZ",
  },
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_SECTION":
      return {
        ...state,
        currentSection: action.payload,
      };
    case "SET_THEME":
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          theme: action.payload,
        },
      };
    case "TOGGLE_NOTIFICATIONS":
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          notifications: !state.userPreferences.notifications,
        },
      };
    case "TOGGLE_AUTO_REFRESH":
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          autoRefresh: !state.userPreferences.autoRefresh,
        },
      };
    case "SET_BREADCRUMBS":
      return {
        ...state,
        navigation: {
          ...state.navigation,
          breadcrumbs: action.payload,
        },
      };
    case "SET_ACTIVE_TAB":
      return {
        ...state,
        navigation: {
          ...state.navigation,
          activeTab: action.payload,
        },
      };
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
