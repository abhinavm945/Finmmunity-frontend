"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";
import { motion } from "framer-motion";
import Link from "next/link";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="max-h-screen bg-gray-50 flex flex-col items-center justify-center fixed top-0 left-0 right-0 bottom-0">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md px-8 py-8 flex flex-col items-center border border-gray-200">
          {/* Logo */}
          <h1 className="text-2xl font-extrabold italic bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 pr-1">
            FINMUNITY
          </h1>
          {/* Access Denied Message */}
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            You must be logged in to access this page.
          </p>
          {/* Login/Signup Buttons */}
          <div className="flex space-x-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Link href="/login">Log in</Link>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <Link href="/signup">Sign up</Link>
            </motion.button>
          </div>
          {/* Back to News Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-2 px-4 py-2 text-blue-500 text-sm font-medium"
          >
            <Link href="/">Back to News</Link>
          </motion.button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
