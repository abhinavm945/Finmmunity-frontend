// Utility to decode JWT and extract user ID from localStorage token
export function getUserIdFromToken(): string | null {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) return null;
  try {
    // JWT: header.payload.signature
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    // Try common user id fields
    return decoded.userId || decoded.id || decoded.sub || null;
  } catch (e) {
    return null;
  }
} 