'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AuthenticationForm } from '@/components/authentication/authentication-form';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

export function SignupForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  async function handleSignup() {
    if (!email || !password) {
      toast({
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        description: 'Password should be at least 6 characters long',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      await signUp(email, password);
      toast({ description: 'Account created successfully' });
      router.push('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage =
        error instanceof FirebaseError ? getFirebaseErrorMessage(error.code) : 'An unexpected error occurred';

      toast({ description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignup() {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast({ description: 'Account created successfully' });
      router.push('/dashboard');
    } catch (error) {
      console.error('Google signup error:', error);
      toast({
        description:
          error instanceof FirebaseError
            ? getFirebaseErrorMessage(error.code)
            : 'Failed to sign up with Google. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function getFirebaseErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Email already in use. Try logging in instead';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/weak-password':
        return 'Password is too weak. It should be at least 6 characters';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled';
      case 'auth/popup-closed-by-user':
        return 'Sign-up popup was closed before completing';
      case 'auth/popup-blocked':
        return 'Sign-up popup was blocked by the browser';
      case 'auth/cancelled-popup-request':
        return 'Sign-up was cancelled';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email but different sign-in credentials';
      case 'firestore/permission-denied':
        return 'Database error. Please try again later.';
      case 'firestore/unavailable':
        return 'Database temporarily unavailable. Please try again later.';
      default:
        return 'Failed to create account. Please try again';
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSignup();
      }}
      className={'px-6 md:px-16 pb-6 py-8 gap-6 flex flex-col items-center justify-center'}
    >
      <Image src={'/assets/icons/logo/aeroedit-icon.svg'} alt={'InsightHub'} width={80} height={80} />
      <div className={'text-[30px] leading-[36px] font-medium tracking-[-0.6px] text-center'}>Create an account</div>

      <Button
        onClick={() => handleGoogleSignup()}
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
        {isLoading ? 'Creating account...' : 'Sign up with Google'}
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
        {isLoading ? 'Creating account...' : 'Sign up'}
      </Button>
    </form>
  );
}
