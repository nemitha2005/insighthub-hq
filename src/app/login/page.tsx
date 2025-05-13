import { AuthCardLayout } from '@/components/authentication/auth-card-layout';
import { LoginForm } from '@/components/authentication/login-form';
import Link from 'next/link';

export default function LoginPage() {
  const footerContent = (
    <div className="text-center text-muted-foreground text-sm mt-4 font-medium">
      Don't have an account?{' '}
      <Link href="/signup" className="text-white hover:text-blue-400 transition-colors">
        Sign up
      </Link>
    </div>
  );

  return (
    <AuthCardLayout footerContent={footerContent}>
      <LoginForm />
    </AuthCardLayout>
  );
}
