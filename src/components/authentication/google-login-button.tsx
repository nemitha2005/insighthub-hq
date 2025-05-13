'use client';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  label: string;
}

export function GoogleLoginButton({ label }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  async function handleGoogleLogin() {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast({ description: 'Logged in successfully' });
      router.push('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        description: 'Failed to login with Google. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={
        'mx-auto w-[343px] md:w-[488px] bg-background/80 backdrop-blur-[6px] px-6 md:px-16 pt-0 py-8 gap-6 flex flex-col items-center justify-center rounded-b-lg'
      }
    >
      <div className={'flex w-full items-center justify-center'}>
        <Separator className={'w-5/12 bg-border'} />
        <div className={'text-border text-xs font-medium px-4'}>or</div>
        <Separator className={'w-5/12 bg-border'} />
      </div>
      <Button onClick={() => handleGoogleLogin()} variant={'secondary'} className={'w-full'} disabled={isLoading}>
        <Image
          height="24"
          className={'mr-3'}
          width="24"
          src="https://cdn.simpleicons.org/google/ffffff"
          unoptimized={true}
          alt={'Google logo'}
        />
        {isLoading ? 'Loading...' : label}
      </Button>
    </div>
  );
}
