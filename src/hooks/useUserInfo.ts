// src/hooks/useUserInfo.ts
import { useEffect, useState } from 'react';

// Define our own User type rather than importing from Supabase
interface User {
  id: string;
  email?: string;
  // Add other user properties as needed
}

// Define a minimal client interface with just what we need
interface MinimalClient {
  auth: {
    getUser: () => Promise<{ data: { user: User | null } }>;
  };
}

export function useUserInfo(supabase: MinimalClient) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    })();
  }, [supabase.auth]);

  return { user };
}