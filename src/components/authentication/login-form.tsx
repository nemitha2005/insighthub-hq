// src/components/authentication/login-form.tsx

'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AuthenticationForm } from '@/components/authentication/authentication-form';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import { Loader2 } from 'lucide-react'; // Import for loading spinner

export function LoginForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  async function handleLogin() {
    if (!email || !password) {
      toast({
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      await signIn(email, password);
      toast({ description: 'Logged in successfully' });
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage =
        error instanceof FirebaseError ? getFirebaseErrorMessage(error.code) : 'An unexpected error occurred';

      toast({ description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }

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

  function getFirebaseErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Please try again later';
      default:
        return 'Failed to login. Please check your credentials';
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
      className={'px-6 md:px-16 pb-6 py-8 gap-6 flex flex-col items-center justify-center'}
    >
      <Image src={'/assets/icons/logo/aeroedit-icon.svg'} alt={'InsightHub'} width={80} height={80} />
      <div className={'text-[30px] leading-[36px] font-medium tracking-[-0.6px] text-center'}>
        Log in to your account
      </div>
      <Button
        onClick={() => handleGoogleLogin()}
        type={'button'}
        variant={'secondary'}
        className={'w-full mt-6 relative'}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
        ) : (
          <Image
            height="24"
            className={'mr-3'}
            width="24"
            src="https://cdn.simpleicons.org/google/ffffff"
            unoptimized={true}
            alt={'Google logo'}
          />
        )}
        {isLoading ? 'Logging in...' : 'Log in with Google'}
      </Button>
      <div className={'flex w-full items-center justify-center'}>
        <Separator className={'w-5/12 bg-border'} />
        <div className={'text-border text-xs font-medium px-4'}>or</div>
        <Separator className={'w-5/12 bg-border'} />
      </div>
      <AuthenticationForm
        email={email}
        onEmailChange={(email) => setEmail(email)}
        password={password}
        onPasswordChange={(password) => setPassword(password)}
      />
      <Button type={'submit'} variant={'secondary'} className={'w-full relative'} disabled={isLoading}>
        {isLoading && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
        {isLoading ? 'Logging in...' : 'Log in'}
      </Button>
    </form>
  );
}
