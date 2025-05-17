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
import { Loader2 } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function LoginForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordResetMode, setPasswordResetMode] = useState(false);
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

  async function handleResetPassword() {
    if (!email) {
      toast({
        description: 'Please enter your email to reset your password',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsResettingPassword(true);
      await sendPasswordResetEmail(auth, email);
      toast({
        description: 'Password reset email sent. Please check your inbox.',
      });
      setPasswordResetMode(false);
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMessage =
        error instanceof FirebaseError ? getFirebaseErrorMessage(error.code) : 'An unexpected error occurred';

      toast({ description: errorMessage, variant: 'destructive' });
    } finally {
      setIsResettingPassword(false);
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
        description:
          error instanceof FirebaseError
            ? getFirebaseErrorMessage(error.code)
            : 'Failed to login with Google. Please try again.',
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
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completing the sign in';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked by the browser';
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email but different sign-in credentials';
      case 'auth/missing-email':
        return 'Please provide an email address';
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'firestore/permission-denied':
        return 'Database error. Please try again later.';
      case 'firestore/unavailable':
        return 'Database temporarily unavailable. Please try again later.';
      default:
        return 'Failed to login. Please check your credentials';
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (passwordResetMode) {
          handleResetPassword();
        } else {
          handleLogin();
        }
      }}
      className={
        'px-4 sm:px-6 md:px-16 pb-4 sm:pb-6 py-6 sm:py-8 gap-4 sm:gap-6 flex flex-col items-center justify-center'
      }
    >
      <Image
        src={'/assets/icons/logo/insighthub-icon.svg'}
        alt={'InsightHub'}
        width={60}
        height={60}
        className="sm:w-20 sm:h-20"
      />
      <div
        className={'text-2xl sm:text-[30px] leading-8 sm:leading-[36px] font-medium tracking-[-0.6px] text-center px-2'}
      >
        {passwordResetMode ? 'Reset your password' : 'Log in to your account'}
      </div>

      {!passwordResetMode && (
        <>
          <Button
            onClick={() => handleGoogleLogin()}
            type={'button'}
            variant={'secondary'}
            className={'w-full mt-4 sm:mt-6 relative'}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
            ) : (
              <Image
                height="20"
                className={'mr-2 sm:mr-3'}
                width="20"
                src="https://cdn.simpleicons.org/google/ffffff"
                unoptimized={true}
                alt={'Google logo'}
              />
            )}
            <span className="text-sm sm:text-base">{isLoading ? 'Logging in...' : 'Log in with Google'}</span>
          </Button>
          <div className={'flex w-full items-center justify-center'}>
            <Separator className={'w-5/12 bg-border'} />
            <div className={'text-border text-xs font-medium px-4'}>or</div>
            <Separator className={'w-5/12 bg-border'} />
          </div>
        </>
      )}

      <AuthenticationForm
        email={email}
        onEmailChange={(email) => setEmail(email)}
        password={password}
        onPasswordChange={(password) => setPassword(password)}
        passwordVisible={!passwordResetMode}
      />

      <Button
        type={'submit'}
        variant={'secondary'}
        className={'w-full relative'}
        disabled={isLoading || isResettingPassword}
      >
        {(isLoading || isResettingPassword) && <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />}
        <span className="text-sm sm:text-base">
          {isLoading
            ? 'Logging in...'
            : isResettingPassword
              ? 'Sending reset email...'
              : passwordResetMode
                ? 'Send reset email'
                : 'Log in'}
        </span>
      </Button>

      <div className="w-full text-center mt-2">
        {passwordResetMode ? (
          <Button
            type="button"
            variant="link"
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setPasswordResetMode(false)}
          >
            Back to login
          </Button>
        ) : (
          <Button
            type="button"
            variant="link"
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setPasswordResetMode(true)}
          >
            Forgot password?
          </Button>
        )}
      </div>
    </form>
  );
}
