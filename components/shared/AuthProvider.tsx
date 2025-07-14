"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUser,
  setToken,
  logoutUserState,
} from "../../redux/userSlice";
import { AppDispatch } from "../../redux/store";
import { socketService } from "../../utils/socket";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state) => state.user);
  const initializedRef = useRef(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  const initializeAuth = useCallback(async () => {
    // Only run on client side to prevent hydration issues
    if (typeof window === "undefined") return;

    // Check for token in localStorage
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      // Set token in Redux store
      dispatch(setToken(storedToken));

      // Get current user data
      try {
        const result = await dispatch(getCurrentUser());

        // If getCurrentUser fails, clear the invalid token
        if (getCurrentUser.rejected.match(result)) {
          console.warn("Invalid token detected, clearing authentication");
          dispatch(logoutUserState());
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Failed to get current user:", error);
        // Clear invalid token
        dispatch(logoutUserState());
        localStorage.removeItem("token");
      }
    }
    setIsAuthInitialized(true);
  }, [dispatch]);

  // Initialize authentication on app load
  useEffect(() => {
    if (!initializedRef.current && typeof window !== "undefined") {
      initializedRef.current = true;
      initializeAuth();
    }
  }, [initializeAuth]);

  // Handle socket connection when user is authenticated
  useEffect(() => {
    if (user && token) {
      socketService.connect(user.id, token);
      // Only join user room after socket is connected
      const tryJoinRoom = () => {
        if (socketService.isReady()) {
          socketService.joinUserRoom(user.id);
        } else {
          setTimeout(tryJoinRoom, 100);
        }
      };
      tryJoinRoom();
    } else {
      socketService.disconnect();
    }

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, [user, token]);

  if (!isAuthInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading authentication...</span>
      </div>
    );
  }

  return <>{children}</>;
}
