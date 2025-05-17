import { AuthCardLayout } from '@/components/authentication/auth-card-layout';
import { SignupForm } from '@/components/authentication/sign-up-form';
import Link from 'next/link';

export default function SignupPage() {
  const footerContent = (
    <div className="text-center text-muted-foreground text-xs sm:text-sm mt-4 font-medium">
      Already have an account?{' '}
      <Link href="/login" className="text-white hover:text-blue-400 transition-colors">
        Log in
      </Link>
    </div>
  );

  return (
    <AuthCardLayout footerContent={footerContent}>
      <SignupForm />
    </AuthCardLayout>
  );
}
