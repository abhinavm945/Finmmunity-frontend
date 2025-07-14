"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearUserError } from "../../redux/userSlice";
import {
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaUser,
} from "react-icons/fa";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.user);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearUserError());
    };
  }, [dispatch]);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await dispatch(
        registerUser({ username, email, password })
      );

      if (registerUser.fulfilled.match(result)) {
        alert("Registration successful! Please log in.");
        router.push("/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full mx-4 bg-white p-8 rounded-xl shadow-lg border border-gray-200 space-y-8"
      >
        {/* Logo */}
        <div>
          <h2 className="text-center text-3xl font-extrabold italic bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FINMUNITY
          </h2>
          <h3 className="mt-2 text-center text-xl font-medium text-gray-700">
            Sign up for an account
          </h3>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSignupSubmit}>
          <div className="space-y-4">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1 relative">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center w-full border border-gray-300 rounded-full px-4 py-2 shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200"
                >
                  <FaUser className="text-gray-400 mr-2" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="flex-grow outline-none placeholder-gray-400 text-sm"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </motion.div>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center w-full border border-gray-300 rounded-full px-4 py-2 shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200"
                >
                  <FaEnvelope className="text-gray-400 mr-2" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="flex-grow outline-none placeholder-gray-400 text-sm"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </motion.div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center w-full border border-gray-300 rounded-full px-4 py-2 shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200"
                >
                  <FaLock className="text-gray-400 mr-2" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="flex-grow outline-none placeholder-gray-400 text-sm"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="text-gray-400 ml-2"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </motion.div>
              </div>
              {/* Password Requirements */}
              <div className="mt-2 text-xs text-gray-500">
                Password must be at least 8 characters long with 1 uppercase, 1
                lowercase, and 1 number
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Signup Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign up"}
          </motion.button>
        </form>

        {/* Google (Optional placeholder) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => alert("Google signup not implemented")}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-full shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
        >
          <FaGoogle className="mr-2 text-red-500" />
          Sign up with Google
        </motion.button>

        {/* Links */}
        <div className="flex justify-between text-sm">
          <Link
            href="/login"
            className="font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            Already have an account?
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
