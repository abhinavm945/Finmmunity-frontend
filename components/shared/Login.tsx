'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email/password login logic here
    console.log('Login submitted', { email, password });
  };

  const handleGoogleLogin = () => {
    // Handle Google OAuth login logic here
    console.log('Continue with Google clicked');
    // Example: window.location.href = '/api/auth/google';
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
            Log in to your account
          </h3>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
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
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Log in
          </motion.button>
        </form>

        {/* Continue with Google Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-full shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
        >
          <FaGoogle className="mr-2 text-red-500" />
          Continue with Google
        </motion.button>

        {/* Links */}
        <div className="flex justify-between text-sm">
          <Link
            href="/forgot-password"
            className="font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            Forgot password?
          </Link>
          <Link
            href="/signup"
            className="font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}