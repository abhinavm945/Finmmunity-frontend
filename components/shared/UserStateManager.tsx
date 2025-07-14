"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { useAuth } from "../../hooks/useAuth";
import { getCurrentUser, initializeAuth } from "../../store/slices/authSlice";

export default function UserStateManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, token } = useAuth();
  const initializedRef = useRef(false);

  // Get user ID from URL
  const urlUserId = searchParams.get("id");

  const handleInitializeAuth = useCallback(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      dispatch(initializeAuth());
    }
  }, [dispatch]);

  const handleGetCurrentUser = useCallback(() => {
    // If we have a token but no user data, try to get current user
    if (token && !user && isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [token, user, isAuthenticated, dispatch]);

  // Initialize authentication on app startup
  useEffect(() => {
    handleInitializeAuth();
  }, [handleInitializeAuth]);

  useEffect(() => {
    handleGetCurrentUser();
  }, [handleGetCurrentUser]);

  useEffect(() => {
    // If user is authenticated but URL doesn't have user ID, add it
    if (
      isAuthenticated &&
      user?.id &&
      !urlUserId &&
      typeof window !== "undefined"
    ) {
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      const newUrl = `${currentPath}${
        currentSearch ? currentSearch + "&" : "?"
      }id=${user.id}`;
      router.replace(newUrl);
    }
  }, [isAuthenticated, user, urlUserId, router]);

  // This component doesn't render anything
  return null;
}
