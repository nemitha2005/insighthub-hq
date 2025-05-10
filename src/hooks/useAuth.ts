import { useState } from 'react';

// Mock authentication hook
export function useUserInfo() {
  // Mock user state
  const [user, setUser] = useState(null);

  const login = () => setUser({ email: 'user@example.com' });
  const logout = () => setUser(null);

  return { user, login, logout };
}
