'use client';

import { useSelector } from 'react-redux';
// import { RootState } from '../redux/store'; // Uncomment if you have RootState type

export const useAuth = () => {
  const auth = useSelector((state) => state.user); // Updated to use new user slice
  
  return {
    user: auth.user,
    isAuthenticated: !!auth.user,
    isLoading: auth.loading,
    error: auth.error,
    token: auth.token,
    userId: auth.user?.id,
  };
}; 