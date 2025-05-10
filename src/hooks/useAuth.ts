import { useState } from 'react';

export function useUserInfo() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  const login = () => setUser({ id: '1', email: 'user@example.com' });
  const logout = () => setUser(null);

  return { user, login, logout };
}
