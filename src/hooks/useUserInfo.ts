import { useEffect, useState } from 'react';

interface User {
  id: string;
  email?: string;
}

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